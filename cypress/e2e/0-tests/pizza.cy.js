describe("İnputa metin giren test", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/pizza");
  });

  it("İnputa bir metin yazılmalı!", () => {
    cy.get('[ data-cy="siparis-notu"]')
      .type("Ketçap ve mayonez gönderir misiniz?")
      .should("have.value", "Ketçap ve mayonez gönderir misiniz?");
  });
  it("Boyut seçimi yapılmalı", () => {
    cy.get('[data-cy="size-select"]').click();
  });
  it(" Kullanıcının form verilerini gönderip gönderemeyeceği", () => {
    cy.get("form").submit();
  });
});
