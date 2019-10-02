/// <reference types="Cypress" />

describe('Main test suit', () => {
  it('prepares the environment', () => {
    cy.task('resetDB');
    cy.task('resetImages');
  });

  it('visits the page', () => {
    cy.visit('http://localhost:8080/');
    cy.get('[data-cy=canvas-item]')
      .should('have.length', 4);
  });

  it('validates item coordinates and size', () => {
    cy.get('[data-cy=canvas-item]').eq(0)
      .should('have.attr', 'style', 'transform: translate(10px, 10px); width: 200px; height: 40px; z-index: 1;');
    cy.get('[data-cy=canvas-item]').eq(1)
      .should('have.attr', 'style', 'transform: translate(30px, 60px); width: 120px; height: 100px; z-index: 1;');
    cy.get('[data-cy=canvas-item]').eq(2)
      .should('have.attr', 'style', 'transform: translate(100px, 200px); width: 100px; height: 60px; z-index: 1;');
    cy.get('[data-cy=canvas-item]').eq(3)
      .should('have.attr', 'style', 'transform: translate(400px, 50px); width: 120px; height: 180px; z-index: 1;');
  });

  it('adds new items and drags', () => {
    cy.get('#addText').click();

    cy.get('[data-cy=canvas-item]')
      .should('have.length', 5);

    const newText = cy.get('[data-cy=canvas-item]').eq(4);
    newText.should('have.text', 'new added text');
    newText.should('have.attr', 'style', 'transform: translate(200px, 200px); width: 200px; height: 100px; z-index: 1;');
    newText.trigger('mousedown', { button: 0 })
      .trigger('mousemove', { button: 0, pageX: 350, pageY: 350 })
      .trigger('mouseup', { button: 0 });
    newText.should('have.attr', 'style', 'transform: translate(57px, 288px); width: 200px; height: 100px; z-index: 2;');
    

    cy.get('[data-cy=image-list-item]').eq(0).click();
    
    cy.get('[data-cy=canvas-item]')
      .should('have.length', 6);
    const newImage = cy.get('[data-cy=canvas-item]').eq(5).find('div');
    newImage.should('have.attr', 'style', 'background-image: url("http://localhost:8000/images/uploads-1462948453043.png");');
    const newImageItem = cy.get('[data-cy=canvas-item]').eq(5);
    newImageItem.should('have.attr', 'style', 'transform: translate(200px, 200px); width: 200px; height: 200px; z-index: 1;');
    newImageItem.trigger('mousedown', { button: 0 })
      .trigger('mousemove', { button: 0, pageX: 375, pageY: 375 })
      .trigger('mouseup', { button: 0 });
    newImageItem.should('have.attr', 'style', 'transform: translate(82px, 263px); width: 200px; height: 200px; z-index: 2;');
  });

  it('refreshes the page to check new items are still there', () => {
    cy.visit('http://localhost:8080/');

    cy.get('[data-cy=canvas-item]')
      .should('have.length', 6);

    const newText = cy.get('[data-cy=canvas-item]').eq(4);
    newText.should('have.text', 'new added text');
    newText.should('have.attr', 'style', 'transform: translate(57px, 288px); width: 200px; height: 100px; z-index: 1;');
    
    const newImage = cy.get('[data-cy=canvas-item]').eq(5).find('div');
    newImage.should('have.attr', 'style', 'background-image: url("http://localhost:8000/images/uploads-1462948453043.png");');
    const newImageItem = cy.get('[data-cy=canvas-item]').eq(5);
    newImageItem.should('have.attr', 'style', 'transform: translate(82px, 263px); width: 200px; height: 200px; z-index: 1;');
  });

  it('deltes elements', () => {
    cy.get('[data-cy=canvas-item]').eq(5).trigger('mousedown', { button: 0 });
    cy.get('[data-cy=canvas-item]').eq(5).trigger('mouseup', { button: 0 });
    cy.get('[data-cy=handler-delete]').trigger('mousedown', { button: 0 });
    cy.get('[data-cy=canvas-item]').should('have.length', 5);

    cy.get('[data-cy=canvas-item]').eq(4).trigger('mousedown', { button: 0 });
    cy.get('[data-cy=canvas-item]').eq(4).trigger('mouseup', { button: 0 });
    cy.get('[data-cy=handler-delete]').trigger('mousedown', { button: 0 });
    cy.get('[data-cy=canvas-item]').should('have.length', 4);
  });

  it('moves items within boundries', () => {
    const item3 = cy.get('[data-cy=canvas-item]').eq(3);
    item3
      .trigger('mousedown', { button: 0 })
      .trigger('mousemove', { button: 0, pageX: 450, pageY: 300 })
      .trigger('mouseup', { button: 0 });
    item3
      .should('have.attr', 'style', 'transform: translate(197px, 198px); width: 120px; height: 180px; z-index: 2;');

    const item0 = cy.get('[data-cy=canvas-item]').eq(0);
    item0
      .trigger('mousedown', { button: 0 })
      .trigger('mousemove', { button: 0, pageX: 700, pageY: 300 })
      .trigger('mouseup', { button: 0 });
    item0
      .should('have.attr', 'style', 'transform: translate(398px, 268px); width: 200px; height: 40px; z-index: 2;');

    item0
      .trigger('mousedown', { button: 0 })
      .trigger('mousemove', { button: 0, pageX: 450, pageY: -300 });
    item0
      .should('have.attr', 'style', 'transform: translate(157px, 0px); width: 200px; height: 40px; z-index: 2;');
    item0
      .trigger('mousemove', { button: 0, pageX: -700, pageY: 300 });
    item0
      .should('have.attr', 'style', 'transform: translate(0px, 268px); width: 200px; height: 40px; z-index: 2;');
    item0
      .trigger('mousemove', { button: 0, pageX: 500, pageY: 400 })
      .trigger('mouseup', { button: 0 });
    item0
      .should('have.attr', 'style', 'transform: translate(207px, 368px); width: 200px; height: 40px; z-index: 2;');
  });

  it('uploads images', () => {
    cy.get('[data-cy=image-list-item]')
      .should('have.length', 5);

    const fileName = 'goku.jpg';
    cy.fixture(fileName).then(fileContent => {
      cy.get('[data-cy=form-control]')
        .upload({ fileContent, fileName, mimeType: 'image/jpeg' }, { subjectType: 'input' });
    });

    cy.get('[data-cy=upload-button]').click();

    // The image has been added.
    cy.get('[data-cy=image-list-item]')
      .should('have.length', 6);
  });

  it('adds and drags the new uploaded image', () => {
    cy.get('[data-cy=image-list-item]').eq(5).click();

    const newImageItem = cy.get('[data-cy=canvas-item]').eq(4);
    newImageItem.should('have.attr', 'style', 'transform: translate(200px, 200px); width: 200px; height: 200px; z-index: 1;');
    newImageItem.trigger('mousedown', { button: 0 })
      .trigger('mousemove', { button: 0, pageX: 375, pageY: 575 })
      .trigger('mouseup', { button: 0 });
    newImageItem.should('have.attr', 'style', 'transform: translate(82px, 398px); width: 200px; height: 200px; z-index: 2;');
  });

  it('refreshes the page to check the new image persists', () => {
    cy.visit('http://localhost:8080/');

    const newImageItem = cy.get('[data-cy=canvas-item]').eq(4);
    newImageItem.should('have.attr', 'style', 'transform: translate(82px, 398px); width: 200px; height: 200px; z-index: 1;');
  });

  it('deletes the new placed image, and checks it is still deleted after refresh', () => {
    cy.get('[data-cy=canvas-item]').eq(4).trigger('mousedown', { button: 0 });
    cy.get('[data-cy=canvas-item]').eq(4).trigger('mouseup', { button: 0 });
    cy.get('[data-cy=handler-delete]').trigger('mousedown', { button: 0 });
    cy.get('[data-cy=canvas-item]').should('have.length', 4);

    cy.visit('http://localhost:8080/');
    cy.get('[data-cy=canvas-item]').should('have.length', 4);
  });
});