# Arquitetura

Para esse projeto, além das tecnologias especificadas no [README](../README.md) eu também utilizei:

- Banco de Dados: [Postgres](https://www.prisma.io/)
- Framework: [NestJS](https://nestjs.com/)
- ORM: [Prisma](https://www.prisma.io/)

## Organização do repositório

Visando simplificar a implementação do teste, escolhi deixar os dos serviços (`indentity-api` e `pricing-api`) no mesmo repositório, dentro da pasta `projects`.
Ambos foram criados usando o NestJS e possuem a mesma organização de diretórios, baseadas em conceito de Clean Architecture e DDD, contendo três camadas principais:

- Domain - Utilizada para definição dos modelos de domínio e suas regras de negócio.
- Application - Utilizada para a criação dos casos de uso, orquestrando os modelos e regras de negócio da camada de domínio.
- Infra - Utilizada para fazer a comunicação com o mundo externo, expondo endpoints e se comunicando com outros serviços.

## Execução do Projeto

- Antes de executar o comando `docker-compose up`, renomeie o arquivo `.env.example` presente nos diretórios `identity-api` e `pricing-api `para `.env`.
- No arquivo `.env.example`, estão fornecidas chaves pública e privada para os testes.
- Após renomear os arquivos de ambiente, execute docker-compose up para iniciar as aplicações conforme descrito no [README](../README.md).

## Testes unitários

- Para visualizar o coverage basta executar `npm run test:cov` dentro de cada projeto, que o relatório de coverage será criado detro da pasta coverage.
- Identity API Coverage:
  ![identity-coverage](./assets/identity-coverage.png)
- Pricing API Coverage:
  ![identity-coverage](./assets/pricing-coverage.png)

## Identity API

Todos os endpoints e seus códigos de erro e sucesso estão documentados dentro dos próprios arquivos de caso de uso. Basta acessá-los para visualizar informações detalhadas sobre payloads, códigos, etc.

### [US-1](./user-stories/identity-api/us-1-user-registration.md) - Criação de usuário

- Apenas usuários com a role de `admin` podem criar outros usuários.
- Optei por utilizar [bcrypt](https://www.npmjs.com/package/bcrypt) para fazer o hash da senha, visando segurança, embora não estivesse inicialmente especificado no teste.

### [US-2](./user-stories/identity-api/us-2-change-user-role.md) - Alteração da role de um usuário

- Apenas usuários com a role de `admin` pode altear outros usuários.

### [US-3](./user-stories/identity-api/us-3-user-login.md) - User login

- Endpoint aberto, não requer token no request.
- Para garantir segurança, em caso de dados de login inválidos, é retornado um erro genérico.

## Pricing API

Todos os endpoints e seus códigos de erro e sucesso estão documentados dentro dos próprios arquivos de caso de uso. Basta acessá-los para visualizar informações detalhadas sobre payloads, códigos, etc.

### [US-4](./user-stories/pricing-api-admin/us-4-create-coverage.md) - Criação de coverage

- Somente usuários com a role role de `admin` podem criar coverages, caso um usuário com a role de `user` tente criar uma coverage, um erro é retornado.

### [US-5](./user-stories/pricing-api-admin/us-5-edit-coverage.md) - Edição de coverage

- Somente usuários com a role `admin` podem editar coverages, caso um usuário com a role de `user` tente criar uma coverage, um erro é retornado.
- Se uma cobertura previamente deletada for atualizada, o soft delete será desfeito e a cobertura será reativada com os novos dados.

### [US-6](./user-stories/pricing-api-admin/us-6-remove-coverage.md) - Deletar coverage

- Somente usuários com a role `role` de deletar coverages, caso um usuário com a role de `user` tente criar uma coverage, um erro é retornado.
- É feito somente um soft delete, inativando a coverage no banco e com isso não permitindo que a mesma seja utilizada para precificação.

### [US-7](./user-stories/pricing-api-user/us-7-dynamic-pricing.md) - Precificar coverage

- A árvore de idades foi implementada como um `Singleton`, o arquivo é carregado pra memória na primeira execução e depois a mesma instância é reutilizada.

## Tratamento dos dados de Ocupação

- Devido ao tamanho pequeno do dataset e por questões de simplicidade, optei por realizar o tratamento dos dados com TypeScript, em vez de usar uma linguagem mais apropriada, como Python.
- Ao analisar o dataset, percebi que alguns códigos de ocupação estava repetidos, como por exemplo:

```
252105,Administrador,TRUE,1.05
252105,Empreendedor,TRUE,1.07
252105,Empresário,TRUE,0.85
252105,Microempreendedor,TRUE,0.87
252105,Administrador,TRUE,1.09
```

- Também percebi que os dados do `factor` não tinham uma discrepância muito grande, por isso, para os casos repetidos, calculei a média dos valores e utilizei essa média como `factor` do código da ocupação.
- Para o nome, juntei todo os nomes dos códigos repetidos e adicionei todos em uma mesma string, separadas por vírgula (como estava em outros casos presente no datase), removendo os nomes repetidos e tratando para que todos os nomes tenham a primeira letra maiúscula.
- No final do tratamento, uma única linha pra cada código foi gerada, como no exemplo abaixo:

```
252105,"Administrador, Empreendedor, Empresário, Microempreendedor",TRUE,1.98
```

- Após o tratamento os dados são inseridos no banco na inicialização da aplicação.

## Distribuição dos recursos

Optei por distribuir os recursos da seguinte maneira:

- **Identity API** - 0,4 vCPUs e 0,5GB de memória
- **Identity DB** - 0,4 vCPUs e 1GB de memória
- **Princing API** - 0,3 vCPUs e 0,6GB de memória por instância
- **Pricing DB** - 0,4 vCPUs e 1GB de memória
- **Nginx** - 0,2 vCPUs e 0,3GB de memória

Não foi possível realizar testes de carga, mas o uso do bcrypt na identity-api pode ser um ponto de atenção. Por isso, aloquei mais vCPUs para a identity-api em comparação com cada instância da pricing-api. Além disso, reduzi a quantidade de salt rounds para 8 (default é 10), visando consumir menos recursos.

Obs: no startup da aplicação também são criados outros dois containers, para executar as migrations e os seeds de cada aplicação. Por eles só executarem os scripts e pararem logo no início da aplicação, tomei a liberade de não contabilizar o mesmo na distribuição dos recursos. 😄

## Próximos passos

- **Load e e2e tests**: Por questões de tempo não conseguir desenvolver esses testes, mas pretendo fazer no futuro (pricipalmente o load test), para ver como a aplicação vai se comportar com os recursos limitados.
- **Otimização de recursos e performance**: É um tema que não conheço muito, mas tenho vontade de estudar mais sobre, por isso pretendo fazer os testes e estudar para entender o que posso fazer para otimizar a aplicação.
- **Melhorias na Documentação** - Acho que posso melhorar a documentação do projeto, tanto nesse arquivo quanto na configuração do swagger no nest por exemplo.
