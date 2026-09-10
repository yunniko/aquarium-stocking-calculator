import { expect, test } from "@playwright/test";

test("stocking calculator computes default stocking level (6 neon tetras in a 29-gallon tank)", async ({
  page,
}) => {
  await page.goto("/stocking-calculator");
  // 1.5in x 0.7 bioload factor x 6 = 6.3 units / 29 gal x 100 = 21.7%.
  await expect(page.getByTestId("stocking-summary")).toContainText("21.7% stocked");
  await expect(page.getByTestId("stocking-summary")).toContainText("lightly stocked");
});

test("stocking calculator recomputes when tank size changes", async ({ page }) => {
  await page.goto("/stocking-calculator");
  // 6.3 units / 9 gal x 100 = 70% exactly -> moderate band.
  await page.getByLabel("Tank size in gallons").fill("9");
  await expect(page.getByTestId("stocking-summary")).toContainText("70% stocked");
  await expect(page.getByTestId("stocking-summary")).toContainText("moderate");
});

test("stocking calculator flags a species below its minimum tank size regardless of bioload", async ({
  page,
}) => {
  await page.goto("/stocking-calculator");
  await page.getByLabel("Species 1").selectOption("oscar");
  await page.getByLabel("Quantity 1").fill("1");
  await expect(page.getByTestId("result")).toContainText("at least 75 gallons");
});

test("stocking calculator flags a schooling species kept below its minimum group size", async ({
  page,
}) => {
  await page.goto("/stocking-calculator");
  await page.getByLabel("Quantity 1").fill("2");
  await expect(page.getByTestId("result")).toContainText("Recommended minimum group size is 6");
});

test("stocking calculator supports adding and removing a second species", async ({ page }) => {
  await page.goto("/stocking-calculator");
  await page.getByRole("button", { name: "+ Add another species" }).click();
  await expect(page.getByLabel("Species 2")).toBeVisible();
  await page.getByLabel("Species 2").selectOption("platy");
  await page.getByLabel("Quantity 2").fill("4");
  await expect(page.getByTestId("result")).toContainText("4x Platy");

  await page.getByRole("button", { name: "Remove" }).first().click();
  await expect(page.getByLabel("Species 2")).toHaveCount(0);
});

test("stocking calculator rejects a non-positive tank size", async ({ page }) => {
  await page.goto("/stocking-calculator");
  await page.getByLabel("Tank size in gallons").fill("0");
  await expect(page.getByTestId("result").getByRole("alert")).toContainText("positive number");
});

test("tank volume calculator computes a standard 10-gallon tank's real dimensions", async ({
  page,
}) => {
  await page.goto("/tank-volume-calculator");
  // 20 x 10 x 12in = 2400 cubic inches = 10.4 gross gallons (39.3 L), 9.4
  // usable gallons (35.4 L) at the 90% estimate.
  await expect(page.getByTestId("result")).toContainText("Gross volume: 10.4 gal (39.3 L)");
  await expect(page.getByTestId("result")).toContainText(
    "Usable volume (est.): 9.4 gal (35.4 L)"
  );
});

test("tank volume calculator switches to cylinder shape and shows diameter field", async ({
  page,
}) => {
  await page.goto("/tank-volume-calculator");
  await page.getByLabel("Tank shape").selectOption("cylinder");
  await expect(page.getByLabel("Diameter")).toBeVisible();
  await expect(page.getByLabel("Length")).toHaveCount(0);
});

test("tank volume calculator rejects a non-positive dimension", async ({ page }) => {
  await page.goto("/tank-volume-calculator");
  await page.getByLabel("Length").fill("0");
  await expect(page.getByTestId("result").getByRole("alert")).toContainText("positive number");
});

test("fish species reference page lists common species", async ({ page }) => {
  await page.goto("/fish-species-reference");
  await expect(page.getByRole("cell", { name: /Neon Tetra/ })).toBeVisible();
  await expect(page.getByRole("cell", { name: /Oscar/ })).toBeVisible();
  await expect(page.getByRole("cell", { name: /Common Pleco/ })).toBeVisible();
});

test("homepage links reach every tool", async ({ page }) => {
  await page.goto("/");
  await page.getByTestId("tool-card-stocking-calculator").click();
  await expect(page).toHaveURL(/\/stocking-calculator$/);
});
