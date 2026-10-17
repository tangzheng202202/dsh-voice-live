# 开源引流计划

只记录结论，这次不改代码。核对日期：2026-10-17。npm 版本、dist-tag、收录条目都以这一天查到的为准。

## 1. 这插件是干什么的

装进 DeepSeek Harness 的网页端之后，输入框左边多一颗麦克风。你对着它说话，声音走本机的 `/voice` 通道，宿主再用火山引擎做流式识别和朗读。停顿大约 1.5 秒就自动把这句话发出去，助手先念一句「好的，我去查一下。」，再把正式回答念出来；你中途开口，播放和这一轮回答都会被打断。火山的 Key 只放在宿主的环境变量里，浏览器不保存、也不上传。

## 2. 陌生人装不上、跑不起来的地方

仓库里已经有可运行的打包结果（`lib/`），也有 `dsh.bundle`。卡住的是依赖版本对不齐，外加这个仓库自己没有测试脚本。

### 2.1 依赖版本互相打架（首要问题）

`package.json` 第 52–64 行的 peer 范围不在同一条版本线上：

| 行 | 包 | 现在写的范围 | 2026-10-17 实际情况 |
| --- | --- | --- | --- |
| 53 | `@deepseek-ai/cordis` | `^4.0.1` | `latest` 是 `4.0.5`，这个范围能对上。对不上 `4.0.1-rc.4`、`4.0.5-alpha.2` |
| 54 | `@deepseek-ai/dsh-web` | `^0.1.0-rc.6` | 能对上 `0.1.0-rc.6` / `0.1.0-rc.8`。对不上 `latest` 标签 `0.0.1-rc.1`，也对不上 `next` 标签 `0.2.1-rc.2`、`0.1.1-rc.2` |
| 55–63 | session、locale、runtime、slots 等 9 个包 | `^0.0.1-rc.1` | 只能对上 `0.0.1-rc.1` 到 `0.0.1-rc.5`。对不上 `0.1.0-rc.6`，也对不上现在的 `next` `0.2.1-rc.2` |

用 node-semver 对过：`^0.0.1-rc.1` 放行 `0.0.1-rc.5`，拒绝 `0.1.0-rc.6` 和 `0.2.1-rc.2`。`^0.1.0-rc.6` 放行 `0.1.0-rc.8`，拒绝 `0.0.1-rc.1`、`0.1.1-rc.2`、`0.2.1-rc.2`。收录指南里举例的 `>=0.0.1-rc.1 <0.1.0 || >=0.1.0-rc.1 <0.2.0-0` 能放行 `0.1.0-rc.6`，放行不了 `0.1.1-rc.2` 和 `0.2.1-rc.2`。预发布版本必须在范围里看到「同一个 major.minor.patch、而且自己也带预发布标签」的比较符，才会被放行。

源码也没用到 `@deepseek-ai/dsh-web`（全仓库没有 import）。它单独写成 `^0.1.0-rc.6`，把整次安装拖垮了。

本机复现（`npm install --ignore-scripts`，npm 10.9.9）：

```
ERESOLVE unable to resolve dependency tree
While resolving: dsh-voice-live@0.1.0
Found: @deepseek-ai/dsh-invariants@0.0.1-rc.1
  peer @deepseek-ai/dsh-invariants@"^0.0.1-rc.1" from the root project
Could not resolve dependency:
  peer @deepseek-ai/dsh-invariants@"^0.1.0-rc.8" from @deepseek-ai/dsh-web@0.1.0-rc.8
    peer @deepseek-ai/dsh-web@"^0.1.0-rc.6" from the root project
```

npm 按第 54 行选了 `dsh-web@0.1.0-rc.8`，按第 63 行选了 `dsh-invariants@0.0.1-rc.1`（这个包的 `latest` 标签还停在 `0.0.1-rc.1`）。`dsh-web@0.1.0-rc.8` 要求 invariants `^0.1.0-rc.8`，两边对不上，安装直接停。

当天查到的 dist-tag：多数 `@deepseek-ai/dsh-*` 是 `latest=0.0.1-rc.1`、`next=0.2.1-rc.2`。例外：`dsh-agent` 的 `latest` 已经是 `0.1.0-rc.6`；`dsh-client-runtime` 的 `next` 只到 `0.1.1-rc.2`，npm 上没有 `0.2.x`；`dsh-invariants` 的 `next` 是 `0.2.0-rc.2`。所以不能把所有 peer 都抄成同一个 `^0.2.1-rc.1`，得先选定一个真实存在的 Harness 版本，再逐个包对。

### 2.2 声明的 runtime 依赖一个 npm 上不存在的包

`README.md` 第 117–124 行写过这件事，这次又装了一遍，仍然成立。

`@deepseek-ai/dsh-client-runtime@0.0.1-rc.1`（也就是它的 `latest` 标签）的 dependencies 里有 `@deepseek-ai/dsh-compact@^0.0.1-rc.1`。`npm view @deepseek-ai/dsh-compact` 返回 404，整个包都没发布。在空目录里执行 `npm install @deepseek-ai/dsh-client-runtime@0.0.1-rc.1`，停在：

```
404 Not Found - GET https://registry.npmjs.org/@deepseek-ai%2fdsh-compact
'@deepseek-ai/dsh-compact@^0.0.1-rc.1' is not in this registry.
```

同系列的 `0.0.1-rc.5` 和 `0.1.0-rc.6` 已经不再依赖 `dsh-compact`。范围如果还把用户带到 `0.0.1-rc.1`，就会踩这个 404。

### 2.3 源码用了、package.json 没写的包

`src/index.ts` 第 9 行：`import type {} from '@deepseek-ai/dsh-agent'`。peerDependencies（第 52–64 行）里没有这个包。它的 `latest` 是 `0.1.0-rc.6`，套用旁边那些 `^0.0.1-rc.1` 也对不上。

测试还直接依赖这些包，devDependencies 第 66 行是空对象 `{}`：

- `tests/apply.client.spec.ts` 第 4–9 行：`cordis`、`vitest`、`dsh-client-runtime`、`dsh-client-locale`、`dsh-client-ui-slots`、`dsh-client-test-runtime`
- `tests/voice-input-button.client.spec.tsx` 第 4 行：`@testing-library/react`
- 同文件第 1 行和 `tests/voice-settings.client.spec.tsx` 第 1 行：`@vitest-environment jsdom`

### 2.4 包名有三套

- `package.json` 第 2 行、`cordis.patch.yml` 第 4 行：`dsh-voice-live`
- `README.md` 第 1 行、`README.zh.md` 第 1 行、`src/invariant.ts` 第 10 行、`lib/client.js` 第 2 行的模块 id：`@deepseek-ai/dsh-client-ui-voice-live`

别人按 README 标题去 `npm install` 或搜包，找不到 `dsh-voice-live`。客户端 bundle 里写死的模块 id 也不是 `package.json` 的 `name`。

### 2.5 发布清单把类型文件丢掉了

`package.json` 第 16–18 行把类型指到 `./lib/types/index.d.ts`，第 67–72 行的 `files` 只收了 `lib/index.js`、`lib/client.js`、`lib/invariant.js`、`cordis.patch.yml`。`npm pack --dry-run` 打出来 9 个文件，没有 `lib/types/`。从 git 安装时 npm 同样按 `files` 打包，类型入口会是空的。

### 2.6 这个仓库不能自己重新编译

- `build.mjs` 第 4–14 行写明：`lib/` 是 monorepo 的快照，脚本只检查三个 js 在不在。
- `tsdown.config.ts` 第 1 行：`import { clientBundle } from '../tsdown.client.ts'`。这个文件在本仓库不存在。
- `.gitignore` 第 2 行忽略了 `lib/`，但这份 `lib/` 又被提交了。下一个人一清理忽略文件，就把唯一能跑的产物删掉。
- `README.md` 第 126–128 行让人去 `github.com/tangzheng202202/deepseek-harness` 这个 fork 里构建。`README.zh.md` 全文到第 54 行结束，没有这段安装说明。

`ws@^8.21.0`（第 49 行）和 `clsx@^2.0.0`（第 50 行）不是这次的问题。registry 上分别有 `8.22.0` 和 `2.1.1`。

### 2.7 测试跑过了，结果如下

源码里 `it(` 一共 137 个，和 `README.md` 第 113 行的数字一致。

1. `npm test`：失败。`package.json` 第 43–46 行只有 `build` 和 `prepublishOnly`，没有 `test`。输出是 `Missing script: "test"`。
2. 按第 52–64 行做一次普通 `npm install`：失败，就是上面的 `ERESOLVE`。测试依赖因此装不进来。
3. 另开一个目录，装「范围里还能装上、且不再依赖 compact」的 `0.0.1-rc.5`（cordis 用 `4.0.5`），再加 vitest 4.1.8、jsdom、testing-library、react 18，然后在本仓库跑 `vitest run`：

- 13 个测试文件里 9 个通过，117 个测试通过。
- 4 个文件在加载阶段失败，里面的 20 个测试没跑到：
  - `tests/apply.client.spec.ts`：`dsh-client-runtime/lib/client.js` 上来就读 `window.__ModuleLoader__.load`，Node 里是 `undefined`。
  - `tests/index.host.spec.ts`：`dsh-session` 继续 import `@deepseek-ai/dsh-scope`，这套临时安装没把它带上（`ERR_MODULE_NOT_FOUND`）。
  - `tests/voice-input-button.client.spec.tsx`、`tests/voice-settings.client.spec.tsx`：加载到 `katex/dist/katex.min.css`，Node 不认 `.css`。

这 117 个通过的断言本身是绿的。README 里「137 个测试、100% 覆盖」目前只能在原来的 monorepo 测试环境里成立，独立克隆做不到。

## 3. 改进清单（按优先级）

先让陌生人 5 分钟内装上并说出第一句话。再补 README 的图、许可证说明和示例。

### P0 五分钟能装上并开口

1. **把 peer 收成同一条真实存在的版本线。** 改 `package.json` 第 53–63 行。先选定要支持的 Harness（建议对着当前 `next`，也就是大多数包的 `0.2.1-rc.2`），每个包的范围都带上该元组的预发布比较符，例如 `>=0.2.1-rc.1 <0.3.0-0`。`dsh-client-runtime` 的 npm `next` 只到 `0.1.1-rc.2`，`dsh-invariants` 的 `next` 是 `0.2.0-rc.2`，写之前用 `npm view <包>@<版本> peerDependencies` 对一遍，避免再写出「纸面上很宽、装的时候静默排除」的范围。第 54 行的 `dsh-web` 源码没用到：要么删掉，要么改成和宿主同一条线。为什么：现在一次 `npm install` 就是 `ERESOLVE`，`dsh plugin add` 也会在 peer 检查上停住。工作量：3 小时，含对着一个真实的 `dsh` 装一遍。

2. **补上 `@deepseek-ai/dsh-agent`。** `src/index.ts` 第 9 行已经在用。范围跟第 1 条同一条线，不要抄 `^0.0.1-rc.1`（它的 `latest` 是 `0.1.0-rc.6`）。为什么：宿主侧打断回答要调 `ctx.agents`。工作量：0.5 小时。

3. **避开 `dsh-compact` 那个 404。** peer 不要再落到 `dsh-client-runtime@0.0.1-rc.1`。`0.0.1-rc.5` 和 `0.1.0-rc.6` 已经不依赖它。为什么：这是 README 自己写过的安装死路，第 2.2 节又复现了。工作量：含在第 1 条里；单独验证 0.5 小时。

4. **README 最上面写一条安装命令。** 中英都写。内容就这些：已装好的 `dsh`、`dsh plugin add` 的具体命令、宿主里设置 `VOLCENGINE_API_KEY` 的位置（`src/client/locales.ts` 第 18、48 行已经指向 `~/.dsh/api-key.env`）、Chrome / Edge 麦克风权限、说完停顿约 1.5 秒会自动发送。`README.zh.md` 现在整篇没有安装段。为什么：现在两篇 README 都从架构讲起，英文第 126–128 行还把人送去一个 fork 里编译。工作量：2 小时。

5. **包名收成一个。** `package.json` 第 2 行、`cordis.patch.yml` 第 4 行、`lib/client.js` 第 2 行、`src/invariant.ts` 第 10 行、两篇 README 第 1 行，用同一个公开名字。客户端 id 写在已提交的 bundle 里，改名要重新打包，不能只改字符串。为什么：读者按标题安装会扑空。工作量：2 小时。

6. **`files` 带上类型，或者改掉 `exports`。** 第 67–72 行补上 `lib/types`，和第 16–18 行对齐。为什么：`npm pack --dry-run` 已经证明类型不会进安装包。工作量：0.5 小时。

7. **仓库根放一个不带真 Key 的配置示例。** 只写变量名 `VOLCENGINE_API_KEY=` 和去哪申请。为什么：设置页文案在源码里，仓库根上没有可复制的例子。工作量：0.5 小时。

### P1 README 的图

8. **补一张动图、两张静图，并写明放哪。** 新建 `assets/`：
   - `assets/voice-live.gif`：点麦克风 → 草稿出现字 → 自动发送 → 听到「好的，我去查一下。」
   - `assets/settings-voices.png`：设置页 30 个音色（列表在 `src/client/usePipelineVoice.ts` 第 9–40 行）
   - `assets/barge-in.png`：朗读时再次开口、播放被打断
   两篇 README 在安装命令下面插入这三张，用仓库里的相对路径。收录列表如果要自己的截图，再往 [data/screenshots.json](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/main/contributing.md) 加 GitHub 托管的 https 图片地址（`raw.githubusercontent.com`），第三方图床会被拒。为什么：现在 README 没有一张图，列表页会退回到「从 README 抽图」，结果是空的。工作量：3 小时，含录屏和裁切。

### P2 许可证

9. **许可证文件已经在，MIT，`LICENSE` 第 1–21 行。** GitHub 也识别成 MIT。要改的是第 3 行署名 `Copyright (c) 2026 DeepSeek`，和仓库所有者 `tangzheng202202` 不是同一个人。README 加一句来源：从 DSH monorepo 的 `packages/client/ui-voice-live` 抽出来（`README.md` 第 112–113 行已经有这句，中文篇没有）。保留 DeepSeek 版权头，还是改成实际维护者，由作者自己定；抽出来的代码如果仍沿用上游许可证，署名就留着，并在 README 写清楚。为什么：引流时最怕被看成冒充官方包。工作量：1 小时。

### P3 示例

10. **加一个最小例子，不新开服务。** README 一小节就够：安装命令、设置 Key、打开网页端、点麦克风说「今天天气怎么样」、预期听到开场白再听到回答。再附一段「没有 Key」时按钮应出现的原文（`src/client/VoiceController.ts` 第 424 行：`后端未配置 VOLCENGINE_API_KEY`）。为什么：协议章节（`README.md` 第 46–56 行）对路过的人太长，例子才能让人 5 分钟走完。工作量：2 小时。

### 做完 P0 再做，不然演示也站不住

11. **让 `npm test` 在本仓库跑完 137 个。** 补上 vitest、jsdom、testing-library 和测试用的 `@deepseek-ai/*`（含 `dsh-client-test-runtime`、`dsh-scope`），并加上 `test` script。client 测试要能加载 `__ModuleLoader__`，css 要有 vitest 的处理，不能再直接用 Node 去读 `katex.min.css`。为什么：第 2.7 节里 20 个测试现在加载失败。工作量：4 小时。

12. **要么能在本仓库构建，要么把「不能构建」写短。** `tsdown.config.ts` 第 1 行的 `../tsdown.client.ts` 得换成仓库里真实存在的脚本；做不到的话，删掉这份会报错的配置，`build.mjs` 继续只做快照检查，并在 README 写明「请使用已提交的 `lib/`」。`.gitignore` 第 2 行不要再忽略已经提交的 `lib/`，或者改成忽略源码映射和 `*.tsbuildinfo`。为什么：陌生人按 `npm run build` 的直觉会以为能编译。工作量：4 小时（真做独立构建）；只改文档和忽略规则的话 1 小时。

13. **GitHub 仓库简介补上一句。** 现在 `description` 是空的。用 package.json 第 3 行那句的前半即可，不要加「最好」「唯一」。为什么：仓库主页、转发卡片和搜索结果都靠这句。官方 awesome 列表不拿它当门槛，另一个同名列表拿它当门槛（见第 4 节）。工作量：0.5 小时。

## 4. awesome-dsh-plugin 收录要求，以及这里还差什么

以官方列表为准：[awesome-dsh-plugin/awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin)，要求写在 [contributing.md](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/main/contributing.md)。下面这些是该文件里写明的，不是猜的。

硬性（CI 会查）：

- `package.json` 里有 `dsh.bundle`，并配一个 `cordis.patch.yml`。只写 `dsh.client` 会被拒。
- 仓库里是真代码，不是空壳。
- 仓库创建满 1 天，且提交不少于 10 个。
- 仓库带 GitHub topic `dsh-plugin`。
- 描述只说功能，和代码对得上，不写广告词。
- 一个 PR 最多加 3 条。条目写在 `data/plugins/<owner>__<repo>.yml`，然后跑 `npm ci && node scripts/generate-readme.mjs`。分类用 `voice`。

维护者还会看：代码是不是描述里那件事、分类是否差不多、是不是和已有条目重复、源码里有没有混淆或安装时外传凭据。CI 通过只是前置条件。

推荐、不挡收录：

- 发到 npm，或者给 GitHub Release 挂一个 https 的 `.tgz`，用条目的 `tarball:` 指过去。仓库如果根本不能从源码安装，这一项是必需的。
- 官方 `@deepseek-ai/*` 放 peerDependencies，并给每个预发布元组一条显式范围（文中的例子是 `>=0.0.1-rc.1 <0.1.0 || >=0.1.0-rc.1 <0.2.0-0`；按第 2.1 节的实测，这行例子覆盖不到今天的 `0.2.1-rc.2`）。
- 截图可选。要交的话放进 `data/screenshots.json`，1–8 张，必须是 GitHub 托管的 https 图片。

本仓库对照：

- 已经在列表里。条目：[data/plugins/tangzheng202202__dsh-voice-live.yml](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/main/data/plugins/tangzheng202202__dsh-voice-live.yml)，分类 `voice`。英文描述是 “Real-time duplex voice over Volcengine streaming ASR/TTS: agent reply narration, barge-in, wake word, live captions, 30 Chinese voices and a reply-first acknowledgment; builds in the DSH monorepo.” 中文对应句也在。30 个音色和 `src/client/usePipelineVoice.ts` 第 9–40 行对得上。
- `dsh.bundle`（`package.json` 第 31–34 行）和 `cordis.patch.yml` 第 2–4 行的形状符合示例。
- topic `dsh-plugin` 已有。仓库 2026-08-16 创建，提交 11 个，满 1 天、满 10 个提交。许可证 GitHub 识别为 MIT。
- 描述里「在 DSH monorepo 内构建」和现状相符，也等于在告诉读者：装上就能用这件事还不成立。安装修好之后，改这一句，去掉 monorepo 限制，改成「用 `dsh plugin add` 安装，需要火山 API Key」。改自己的条目时只改这个 yml，再重新生成 README。
- 还差的是「装上之后确实能做描述里那件事」。peer 范围和 `dsh-compact` 404 会让维护者在复查时把它当成坏掉的条目删掉。列表规则写了：停止维护或有明显缺陷的条目会被移除。
- 没有 npm 包，也没有 Release tarball。源码安装现在会 `ERESOLVE`，按他们的规则，这种仓库要提供 tarball。P0 修好之后这条可以不做。
- 没有截图。可选。
- 同分类里已经有不少语音插件（例如不需要 API Key 的全双工方案）。描述继续写火山流式识别、朗读、打断、30 个音色即可，不要写「更好」。

另外两个名字相近的列表，要求不一样，不要混用：

- [bruc3van/awesome-dsh-plugin 的 CONTRIBUTING.md](https://github.com/bruc3van/awesome-dsh-plugin/blob/main/CONTRIBUTING.md)：公开仓库、`dsh-plugin` topic、必须填写 GitHub 简介、本身是可安装插件、说明要短且能核对、要披露缺许可证或明显安全风险。本仓库的 GitHub 简介是空的，这一条过不了。2026-10-17 在它的 README 里没搜到本仓库。
- [cccakeee/awesome-dsh-plugins 的中文贡献说明](https://github.com/cccakeee/awesome-dsh-plugins/blob/main/docs/CONTRIBUTING.zh-CN.md)：要有可复制的安装命令、SPDX 许可证或明确写 Not found、以及 API Key / 网络 / 浏览器登录态等风险说明。本仓库缺安装命令和风险小节。同一天在它的 README 里也没搜到本仓库。

## 5. 30–60 秒演示，镜头顺序

总长大约 45 秒。画面上不要出现真的 API Key，设置页只露出变量名。

| 秒 | 画面 | 说什么 |
| --- | --- | --- |
| 0–5 | 终端，一条已经成功的安装命令，光标停在提示符 | 「一行装进 DeepSeek Harness。」 |
| 5–12 | 聊天页。鼠标点输入框左边的麦克风，按钮变成圆球 | 「点一下，直接说。」 |
| 12–22 | 对着麦克风说「今天天气怎么样」。草稿里字在长，停顿后消息自己发出去 | 「不用点发送。」 |
| 22–32 | 先听到「好的，我去查一下。」，接着听到正式回答。字幕停在输入框草稿那一行 | 「先应一声，再把回答念出来。」 |
| 32–38 | 回答还在念的时候再说半句。播放停下，新的识别开始 | 「说话就能打断。」 |
| 38–45 | 切到语音设置，点一个别的音色，试听半秒，切回仓库地址 | 「30 个音色，Key 只放在自己机器上。」 |

唤醒词默认是关的，这 45 秒里不要演示它。Chrome 的网页语音识别在国内网络上会失败，README 第 79–84 行写了；演示用麦克风按钮这条火山链路，不要用唤醒。

## 6. 公开风险检查（只看，不改）

全仓库搜过密钥、token、邮箱、手机号、绝对个人路径、内网地址。没有发现真密钥、token、邮箱或手机号。下面这些要心里有数，都不是能直接拿去调用的凭据。

- `tests/index.host.spec.ts` 第 44、78 行：`process.env.VOLCENGINE_API_KEY = 'configured-key'`。这是测试用的假字符串，不是火山 Key。
- `src/host/volcengine.ts` 第 7 行，以及打进包里的 `lib/index.js` 第 13 行：注释里有相对路径 `voice-pipeline/.venv/lib/python3.14/site-packages/doubao_speech/_ws_client.py`。没有用户名，也没有盘符，是内部参考实现的相对路径，公开后会露出这套代码从哪份 Python 客户端移植来。
- `src/client/locales.ts` 第 18、48 行：文案里的 `~/.dsh/api-key.env`。这是告诉用户 Key 放哪，不是某台机器的真实路径。
- `src/index.ts` 第 20 行、`src/client/VoiceController.ts` 第 424 行：只出现环境变量的名字 `VOLCENGINE_API_KEY`，没有值。
- `tests/voice-trust.host.spec.ts` 第 13、16、24、30、36、45–47 行，以及 `tests/voice-controller.client.spec.ts` 第 122 行、`tests/voice-server.host.spec.ts` 里多处：`127.0.0.1`、`localhost`、`192.168.1.5`。这是回环和「远程 Host 必须拒绝」的测试数据，不是内部服务器地址。
- `package.json` 第 10、82、84 行：仓库地址 `github.com/tangzheng202202/dsh-voice-live`。这是公开仓库自己的地址。
- 11 个提交的作者邮箱都是 `andy.t@163.com`（`git log` 里的 author，工作区文件里没有这个地址）。公开仓库的提交记录谁都能看到。想换成 GitHub 的 noreply 邮箱，要改今后的提交身份；已经推上去的历史要改写，引流仓库一般不值得为这个强推。
- 已提交的 source map 里没有 `/Users/`、`/home/` 这类绝对路径。
- 没有 `.env`，没有私钥块，没有 `sk-`、`ghp_`、`AKIA` 这类前缀。

`LICENSE` 第 3 行的版权人是 DeepSeek，不是泄露，是署名和仓库所有者不一致，放在第 3 节第 9 条处理。
