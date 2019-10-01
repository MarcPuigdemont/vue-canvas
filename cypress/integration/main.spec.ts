/// <reference types="Cypress" />

beforeEach(() => {
  cy.task('resetDB');
});
describe('Main test suit', () => {
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

  it('adds new items', () => {
    cy.get('#addText').click();

    cy.get('[data-cy=canvas-item]')
      .should('have.length', 5);
    cy.get('[data-cy=canvas-item]').eq(4)
      .should('have.text', 'new added text');

    cy.get('[data-cy=image-list-item]').eq(0).click();
    
    cy.get('[data-cy=canvas-item]')
      .should('have.length', 6);
    cy.get('[data-cy=canvas-item]')
      .eq(5)
      .find('div')
      .should('have.attr', 'style', 'background-image: url("http://localhost:8000/images/uploads-1462948453043.png");');

    // refresh
    cy.visit('http://localhost:8080/');
    cy.get('[data-cy=canvas-item]')
      .should('have.length', 6);
    cy.get('[data-cy=canvas-item]').eq(4)
      .should('have.text', 'new added text');
    cy.get('[data-cy=canvas-item]')
      .eq(5)
      .find('div')
      .should('have.attr', 'style', 'background-image: url("http://localhost:8000/images/uploads-1462948453043.png");');
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
    cy.get('[data-cy=canvas-item]').eq(3)
      .trigger('mousedown', { button: 0 })
      .trigger('mousemove', { button: 0, pageX: 300, pageY: 300 })
      .trigger('mouseup', { button: 0 });
    cy.get('[data-cy=canvas-item]').eq(2)
      .should('have.attr', 'style', 'transform: translate(100px, 200px); width: 100px; height: 60px; z-index: 1;');

    cy.get('[data-cy=canvas-item]').eq(0)
      .trigger('mousedown', { button: 0 })
      .trigger('mousemove', { button: 0, pageX: 700, pageY: 300 })
      .trigger('mouseup', { button: 0 });
    cy.get('[data-cy=canvas-item]').eq(0)
      .should('have.attr', 'style', 'transform: translate(398px, 268px); width: 200px; height: 40px; z-index: 2;');
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
});