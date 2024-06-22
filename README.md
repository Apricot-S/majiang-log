# majiang-log

電脳麻将形式の牌譜を天鳳形式に変換する

## インストール / Install

## 使用例 / Usage

ビルド

```sh
majiang-log$ docker build -t apricot-s/majiang-log .
```

実行

```sh
cat PATH/TO/majiang-game-record.json | docker run -i apricot-s/majiang-log --mode log > PATH/TO/your-favorite-name.json
```

## ライセンス / License

Copyright (c) Apricot S. All rights reserved.

Licensed under the [MIT license](LICENSE).
