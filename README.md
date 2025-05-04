# 🚗 Vehicle-CRUD

Este repositório contém:
- Um **backend** em NestJS que expõe uma API REST de gerenciamento de veículos
- Um **broker de mensagens** já implementado (ele apenas faz logs locais, porém pode ser feito um logger para gravar em um arquivo, ou enviar notificações para ações que supostos usuários fariam na aplicação)
- Um **frontend** em Angular para exibir, criar, editar e remover veículos. (Mais básico e local(sem Docker) pois percebi que não valia a pena o trabalho de Dockerizar tudo)

---

## 📋 Pré-requisitos

Antes de começar, tenha instalado em sua máquina:
- **Docker** e **Docker Compose** 
- **Angular CLI**

---

## 🔧 Passo a passo

# 🏠 Localmente

### 📨 Executando o **Broker(RabbitMQ)**

1. Na pasta do projeto clonado, execute:
    ```bash
    docker-compose up -d rabbitmq
    ```

### 🖥️ Executando o **Backend**

1. Na pasta do projeto clonado, suba os serviços:
    ```bash
    npm run start
    ```

---

# 🐳 Com Docker Compose

1. Suba os serviços:
    ```bash
    docker-compose build --no-cache
    docker-compose up -d
    ```
### O backend estará disponível em http://localhost:3000  
### O RabbitMQ em http://localhost:15672

---

## 🌐 Executando o **Frontend**

### Local (sem Docker)

1. Abra um terminal após clonar o projeto:
    ```bash
    cd frontend
    npm install
    ```
2. Inicie o servidor de desenvolvimento do Angular:
    ```bash
    npm run ng serve
    ```
3. A aplicação abrirá em http://localhost:4200 e consumirá a API em http://localhost:3000.

4. Acesse http://localhost:4200

---

## 🔗 Endpoints Principais

| Método | Rota               | Descrição              |
| ------ | ------------------ | ---------------------- |
| GET    | /vehicles          | Listar todos veículos  |
| GET    | /vehicles/:id      | Obter um veículo pelo ID |
| POST   | /vehicles          | Criar novo veículo     |
| PATCH  | /vehicles/:id      | Atualizar veículo      |
| DELETE | /vehicles/:id      | Remover veículo        |

---

## ⚙️ Observações

- O SQLite armazena o arquivo em `./data/vehicles.sqlite` (montado como volume).