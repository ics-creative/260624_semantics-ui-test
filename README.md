ICS MEDIA「[HTMLのセマンティクスを意識して、壊れにくいテストコードを書こう](https://ics.media/entry/260624/)」のサンプルコードです。

| ページ | 内容 |
| --- | --- |
| `index.html` | セマンティクス版（記事の iframe で表示） |
| `bad.html` | NG 版（`data-testid`、span ラベル、div モーダルなど） |

Playwright のセットアップは [Playwright 前編](https://ics.media/entry/251226/) を参照してください。

## 使い方

```bash
npm install
npx playwright install chromium
npm run dev        # デモを http://localhost:5181 で開く
npm run e2eTest    # E2E テスト
```

`docs/js/` は `npm run build` で生成されます（`dev` と `e2eTest` 実行時に自動で build されます）。
