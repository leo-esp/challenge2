import App from './App'

describe('Application Test', () => {
    beforeEach(() => {
        // see: https://on.cypress.io/mounting-react
        cy.mount(<App />)

    })

    it("should show error message", () => {
        cy.intercept('GET', 'https://api.github.com/search/users?q=').as('searchUsers')

        cy.get('button').click();
        cy.wait('@searchUsers');
        cy.get('ul').should('not.be.visible');
        cy.get('h1:last-child').should('have.text', 'Ocorreu algum erro!')
    })

    it("searches an not found user", () => {
        cy.intercept('GET', 'https://api.github.com/search/users?q=123oliverira4+5').as('searchUsers')

        cy.get('input').type("123oliverira4 5");
        cy.get('button').click();
        cy.wait('@searchUsers');
        cy.get('ul').should('not.be.visible');
        cy.get('h1:last-child').should('have.text', 'Não foram encontrados usuários')
    })

    it("searches an user", () => {
        cy.intercept('GET', 'https://api.github.com/search/users?q=leo-esp').as('searchUsers')

        cy.get('input').type("leo-esp");
        cy.get('button').click();
        cy.wait('@searchUsers');
        cy.get('ul').should('be.visible');
        cy.get('li:first>div>span:first').should('have.text', 'leo-esp')
        cy.get('li:first>div>span:nth-child(2)').should('have.text', 'https://github.com/leo-esp')
    })

    it("should get user's details", () => {
        cy.intercept('GET', 'https://api.github.com/search/users?q=leo-esp').as('searchUsers')
        cy.intercept('GET', 'https://api.github.com/users/leo-esp').as('getUser')

        cy.get('input').type("leo-esp");
        cy.get('button').click();
        cy.wait('@searchUsers');
        cy.get('ul').should('be.visible');
        cy.get('li:first').click();
        cy.wait('@getUser');
        cy.get('[data-cy="modal"]').wait(300).should('be.visible');
        cy.get('[data-cy="modal"] span:nth-child(1)').should('have.text', 'Leonardo Esposito');
        cy.get('[data-cy="modal"] span:nth-child(2)').should('have.text', 'leo-esp');
        cy.get('[data-cy="modal"] span:nth-child(3)').should('have.text', 'Localização não informada');
        cy.get('[data-cy="modal"] span:nth-child(4)').should('have.text', 'E-mail não informado');
        cy.get('[data-cy="modal"] span:nth-child(5)').should('have.text', '22 repositórios públicos');

    })
})