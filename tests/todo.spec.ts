import {expect, test} from '@playwright/test';

test.describe('TODO リスト（セマンティクス版）', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/');
  });

  test('追加 → 明日の「牛乳を買う」を削除できる（記事の通しテスト）', async ({page}) => {
    await page.getByLabel('やること').fill('メールを返す');
    await page.getByRole('button', {name: '追加'}).click();
    await expect(
      page.getByRole('region', {name: '今日'}).getByRole('listitem').filter({hasText: 'メールを返す'}),
    ).toBeVisible();

    const tomorrow = page.getByRole('region', {name: '明日'});
    const milk = tomorrow.getByRole('listitem').filter({hasText: '牛乳を買う'});
    await milk.getByRole('button', {name: '削除する: 牛乳を買う'}).click();

    const dialog = page.getByRole('dialog', {name: '削除の確認'});
    await dialog.getByRole('button', {name: '削除する'}).click();

    await expect(dialog).toBeHidden();
    await expect(tomorrow.getByRole('listitem').filter({hasText: '会議の準備'})).toBeVisible();
    await expect(milk).toHaveCount(0);
    await expect(
      page.getByRole('region', {name: '今日'}).getByRole('listitem').filter({hasText: '牛乳を買う'}),
    ).toBeVisible();
  });

  test('region 内で checkbox の操作と aria-label 付き削除ができる', async ({page}) => {
    const tomorrow = page.getByRole('region', {name: '明日'});
    const milk = tomorrow.getByRole('listitem').filter({hasText: '牛乳を買う'});

    await milk.getByRole('checkbox').check();
    await expect(milk.getByRole('checkbox')).toBeChecked();
    await milk.getByRole('button', {name: '削除する: 牛乳を買う'}).click();

    const dialog = page.getByRole('dialog', {name: '削除の確認'});
    await dialog.getByRole('button', {name: '削除する'}).click();
    await expect(milk).toHaveCount(0);
  });

  test('aria-label だけでは page 全体では同名ボタンが複数ヒットする', async ({page}) => {
    await expect(
      page.getByRole('button', {name: '削除する: 牛乳を買う'}),
    ).toHaveCount(2);
  });
});
