# majiang-log

[電脳麻将](https://github.com/kobalab/Majiang)形式の[牌譜](https://github.com/kobalab/majiang-core/wiki/%E7%89%8C%E8%AD%9C)を[天鳳](https://tenhou.net/)形式 (https://tenhou.net/6/ 形式) に変換する

※ 電脳麻将ルールのみ対応している

## インストール / Install

Docker を使用する場合はインストール不要

```sh
majiang-log$ npm install
majiang-log$ npm run build
majiang-log$ npm install -g --omit=dev
```

## 使用例 / Usage

### コマンドラインから

```sh
majiang-log < PATH/TO/majiang-game-record.json > PATH/TO/your-favorite-name.txt
```

#### Docker を使用する場合

イメージのビルド

```sh
majiang-log$ docker build -t apricot-s/majiang-log .
```

変換

```sh
cat PATH/TO/majiang-game-record.json | docker run --rm -i apricot-s/majiang-log > PATH/TO/your-favorite-name.txt
```

### 変換サーバとして起動

サーバ起動

```sh
majiang-log-server &
```

変換

```sh
curl -sS http://127.0.0.1:8001/majiang-log/log -H 'Content-Type: application/json' -d @PATH/TO/majiang-game-record.json -o PATH/TO/your-favorite-name.txt
```

### ライブラリとして

```ts
import { convertLog, MODE } from '@apricot-s/majiang-log';

// Game record (JSON in Majiang format)
const paipu = {
  /* Game record data */
};

const mode = MODE.Log; // or MODE.Viewer

const result = convertLog(paipu, mode);
```

## オプション / Option

### majiang-log [--mode *(log|viewer)*]

- `--mode`, `-m`  
変換モードを指定する (デフォルト値は `log`)
  - `log`  
JSON ログ (mjai-reviewer 用)
  - `viewer`  
天鳳牌譜ビューア URL (NAGA 用)

### majiang-log-server

- `--port`, `-p`  
変換サーバを起動するポート番号 (デフォルト値は `8001`)
- `--baseurl`, `-b`  
変換サーバに割り当てるURL(デフォルト値は `/majiang-log/`)

#### URL

- **/majiang-log/log**  
牌譜を JSON ログ (mjai-reviewer 用) に変換する
- **/majiang-log/viewer**  
牌譜を天鳳牌譜ビューア URL (NAGA 用) に変換する

## 類似アプリ / Other similar apps

- [tenhou-url-log](https://github.com/kobalab/tenhou-url-log) - 電脳麻将の作者 [Satoshi Kobayashi](https://github.com/kobalab) さんによる実装、npm パッケージとして公開されている ([@kobalab/tenhou-url-log](https://www.npmjs.com/package/@kobalab/tenhou-url-log))

## ライセンス / License

Copyright (c) Apricot S. All rights reserved.

Licensed under the [MIT license](LICENSE).
