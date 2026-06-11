import {expect, test} from '@playwright/test';

test.describe('NG 版（bad.html）', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/bad.html');
  });

  test('CSSクラスに依存してTODOを追加する', async ({page}) => {
    await page.locator('.todo-input').fill('メールを返す');
    await page.locator('.btn-add').click();
    await expect(page.locator('.todo-text', {hasText: 'メールを返す'})).toBeVisible();
  });

  test('data-testidに依存してTODOを追加する', async ({page}) => {
    await page.getByTestId('todo-input').fill('メールを返す');
    await page.getByTestId('add-button').click();
    await expect(page.getByTestId('todo-text').filter({hasText: 'メールを返す'})).toBeVisible();
  });

  test('getByTextのnthで削除ボタンを決め打ちする', async ({page}) => {
    await page.getByText('削除する').nth(0).click();
    await page.getByTestId('confirm-delete-button').click();
    await expect(page.getByText('牛乳を買う')).toHaveCount(1);
    await expect(
      page.getByTestId('panel-tomorrow').getByText('牛乳を買う'),
    ).toBeVisible();
  });

  test('textboxのnthで追加入力欄を決め打ちする', async ({page}) => {
    await page.getByRole('textbox').nth(1).fill('メールを返す');
    await page.getByTestId('add-button').click();
    await expect(page.getByText('メールを返す')).toBeVisible();
  });

  test('first()で一覧側の削除ボタンを拾う', async ({page}) => {
    await page.getByText('削除する').first().click();
    await page.getByTestId('confirm-delete-button').click();
    await expect(
      page.getByTestId('panel-today').getByText('牛乳を買う'),
    ).toHaveCount(0);
    await expect(
      page.getByTestId('panel-tomorrow').getByText('牛乳を買う'),
    ).toBeVisible();
  });

  test('regionで絞らずnthで明日のTODOを削除する', async ({page}) => {
    await page.getByText('削除する').nth(1).click();
    await page.getByTestId('confirm-delete-button').click();
    await expect(page.getByText('牛乳を買う')).toHaveCount(1);
    await expect(
      page.getByTestId('panel-today').getByText('牛乳を買う'),
    ).toBeVisible();
  });
});
