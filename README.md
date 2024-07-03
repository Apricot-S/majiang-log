# majiang-log

電脳麻将形式の牌譜を天鳳形式に変換する

## インストール / Install

Docker を使用する場合はインストール不要

```sh
majiang-log$ npm install -g
```

## 使用例 / Usage

### コマンドラインから

```sh
majiang-log < PATH/TO/majiang-game-record.json > PATH/TO/your-favorite-name.txt
```

Docker を使用する場合

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
curl -sS http://127.0.0.1:8001/majiang-log/ -H 'Content-Type: application/json' -d @PATH/TO/majiang-game-record.json -o PATH/TO/your-favorite-name.txt
```

## オプション / Option

変換モード

- `log`: JSON log (for mjai-reviewer)
- `viewer`: Tenhou viewer URLs (for NAGA)

### majiang-log [--mode *(log|viewer)*]

- `--mode`, `-m`: 変換モードを指定する (デフォルト値は `log`)

### majiang-log-server

- `--port`, `-p`: 変換サーバを起動するポート番号 (デフォルト値は `8001`)
- `--baseurl`, `-b`: 変換サーバに割り当てるURL(デフォルト値は `/majiang-log/`)
- `--mode`, `-m`: 変換モードを指定する (デフォルト値は `log`)

## ライセンス / License

Copyright (c) Apricot S. All rights reserved.

Licensed under the [MIT license](LICENSE).
