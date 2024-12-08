import express from 'express';
import path from 'path';
import session from 'express-session';
import cookieParser from 'cookie-parser';

const app = express();
app.use(session({
    secret: 'M1nh4Chav3S3cr3t4',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 30
    }
}));

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), 'pages/public')));

const porta = 3000;
const host = '0.0.0.0';

var listaUsuarios = [];
const mensagens = [];

function menuView(req, resp) {
    const dataHoraUltimoLogin = req.cookies['dataHoraUltimoLogin'];
    if (!dataHoraUltimoLogin) {
        dataHoraUltimoLogin = '';
    }

    resp.send(`
        <html>
            <head>
                <meta charset="utf-8">
                <title>Cadastro de Usuarios</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
            </head>
            <body>
                <nav class="navbar navbar-expand-lg bg-body-tertiary">
                    <div class="container-fluid">
                        <a class="navbar-brand" href="/">MENU</a>
                        <div class="collapse navbar-collapse justify-content-center" id="navbarNavAltMarkup">
                            <div class="navbar-nav">
                                <a class="nav-link active" aria-current="page" href="/cadastrarUsuario">Cadastrar Usuário</a>
                                <a class="nav-link active" aria-current="page" href="/chat">Chat</a>
                                <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Seu último acesso foi realizado em ${dataHoraUltimoLogin}</a>
                                <a class="nav-link active text-danger" aria-current="page" href="/logout">Sair</a>
                            </div>
                        </div>
                    </div>
                </nav>  
            </body>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
        </html>
        `);
}

function cadastroUsuarioView(req, resp) {
    const dataHoraUltimoLogin = req.cookies['dataHoraUltimoLogin'];
    if (!dataHoraUltimoLogin) {
        dataHoraUltimoLogin = '';
    }
    resp.send(`
            <html>
                <head>
                    <meta charset="utf-8">
                    <title>Cadastro de Usuarios</title>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
                </head>
                <body>
                    <nav class="navbar navbar-expand-lg bg-body-tertiary">
                        <div class="container-fluid">
                            <a class="navbar-brand" href="/">MENU</a>
                            <div class="collapse navbar-collapse justify-content-center" id="navbarNavAltMarkup">
                                <div class="navbar-nav">
                                    <a class="nav-link active" aria-current="page" href="/cadastrarUsuario">Cadastrar Usuário</a>
                                    <a class="nav-link active" aria-current="page" href="/chat">Chat</a>
                                    <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Seu último acesso foi realizado em ${dataHoraUltimoLogin}</a>
                                    <a class="nav-link active text-danger" aria-current="page" href="/logout">Sair</a>
                                </div>
                            </div>
                        </div>
                    </nav>
                    <div class="container w-25 text-center">
                        <h1 class="mb-5">Cadastro de Usuário</h1>
                        <form method="POST" action="/cadastrarUsuario" class="border p-3 row g-3" novalidate>
                            <!-- Nome -->
                            <div class="col-12">
                                <label for="nome" class="form-label">Nome</label>
                                <input type="text" class="form-control" id="nome" name="nome" placeholder="Digite seu nome">
                            </div>
                            <!-- Apelido -->
                            <div class="col-12">
                                <label for="apelido" class="form-label">Apelido</label>
                                <input type="text" class="form-control" id="apelido" name="apelido" placeholder="Digite seu apelido">
                            </div>
                            <!-- Data de Nascimento -->
                            <div class="col-12">
                                <label for="dataNascimento" class="form-label">Data de Nascimento</label>
                                <input type="date" class="form-control" id="dataNascimento" name="dataNascimento">
                            </div>
                            <!-- Botão -->
                            <div class="col-12">
                                <button class="btn btn-primary w-100" type="submit">Cadastrar</button>
                            </div>
                        </form>
                    </div>

                </body>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
            </html>
    `);
}

function cadastrarUsuario(req, resp) {
    const nome = req.body.nome;
    const apelido = req.body.apelido;
    const dataNascimento = req.body.dataNascimento;

    const dataHoraUltimoLogin = req.cookies['dataHoraUltimoLogin'];
    if (!dataHoraUltimoLogin) {
        dataHoraUltimoLogin = '';
    }

    if (nome && apelido && dataNascimento) {
        const usuario = { nome, apelido, dataNascimento};

        listaUsuarios.push(usuario);


        resp.write(`
            <html>
                <head>
                    <meta charset="utf-8">
                    <title>Lista de alunos</title>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" 
                          integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" 
                          crossorigin="anonymous">
                </head>
                <body>
                <nav class="navbar navbar-expand-lg bg-body-tertiary">
                        <div class="container-fluid">
                            <a class="navbar-brand" href="/">MENU</a>
                            <div class="collapse navbar-collapse justify-content-center" id="navbarNavAltMarkup">
                                <div class="navbar-nav">
                                    <a class="nav-link active" aria-current="page" href="/cadastrarUsuario">Cadastrar Usuário</a>
                                    <a class="nav-link active" aria-current="page" href="/chat">Chat</a>
                                    <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Seu último acesso foi realizado em ${dataHoraUltimoLogin}</a>
                                    <a class="nav-link active text-danger" aria-current="page" href="/logout">Sair</a>
                                </div>
                            </div>
                        </div>
                </nav>
                    <div class="container mt-5">
                        <h1 class="text-center mb-4">Lista de Alunos</h1>
                        <table class="table table-hover">
                            <thead class="table-light">
                                <tr>
                                    <th scope="col" class="text-center">Nome</th>
                                    <th scope="col" class="text-center">Apelido</th>
                                    <th scope="col" class="text-center">Data de Nascimento</th>
                                </tr>
                            </thead>
                            <tbody>
        `);
        for (let usuario of listaUsuarios) {
            resp.write(`
                <tr>
                    <td class="text-center">${usuario.nome}</td>
                    <td class="text-center">${usuario.apelido}</td>
                    <td class="text-center">${usuario.dataNascimento}</td>
                </tr>
            `);
        }
        
        resp.write(`
                            </tbody>
                        </table>
                        <div class="d-flex justify-content-center gap-3 mt-4">
                            <a class="btn btn-primary" href="/cadastrarAluno">Continuar Cadastrando</a>
                            <a class="btn btn-success" href="/chat">Ir para o Chat</a>
                            <a class="btn btn-secondary" href="/">Voltar para o Menu</a>
                        </div>
                    </div>
                </body>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" 
                        integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" 
                        crossorigin="anonymous"></script>
            </html>
        `);        
    }
    else {

        resp.write(`
            <html>
                <head>
                    <meta charset="utf-8">
                    <title>Cadastro de Usuários</title>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
                </head>
                <body>
                <nav class="navbar navbar-expand-lg bg-body-tertiary">
                        <div class="container-fluid">
                            <a class="navbar-brand" href="/">MENU</a>
                            <div class="collapse navbar-collapse justify-content-center" id="navbarNavAltMarkup">
                                <div class="navbar-nav">
                                    <a class="nav-link active" aria-current="page" href="/cadastrarUsuario">Cadastrar Usuário</a>
                                    <a class="nav-link active" aria-current="page" href="/chat">Chat</a>
                                    <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Seu último acesso foi realizado em ${dataHoraUltimoLogin}</a>
                                    <a class="nav-link active text-danger" aria-current="page" href="/logout">Sair</a>
                                </div>
                            </div>
                        </div>
                </nav>
                    <div class="container w-25 text-center">
                        <h1 class="mb-5">Cadastro de Usuário</h1>
                        <form method="POST" action="/cadastrarUsuario" class="border p-3 row g-3" novalidate>
                            <!-- Nome -->
                            <div class="col-12">
                                <label for="nome" class="form-label">Nome</label>
                                <input type="text" class="form-control" id="nome" name="nome" placeholder="Digite seu nome" value="${nome}">
        `);
        if (!nome) {
            resp.write(`
                <div>
                    <span><p class="text-danger">Informe o nome do usuário</p></span>
                </div>
                `);
        }
        resp.write(`</div>
                        <div class="col-12">
                                <label for="apelido" class="form-label">Apelido</label>
                                <input type="text" class="form-control" id="apelido" name="apelido" placeholder="Digite seu apelido"value="${apelido}">`);
        if (!apelido) {
            resp.write(`
                <div>
                    <span><p class="text-danger">Informe o apelido do usuário</p></span>
                </div>
                `);
        }
        resp.write(`
            </div>
                <div class="col-12">
                                <label for="dataNascimento" class="form-label">Data de Nascimento</label>
                                <input type="date" class="form-control" id="dataNascimento" name="dataNascimento" value="${dataNascimento}">
            `);
        if (!dataNascimento) {
            resp.write(`
                <div>
                    <span><p class="text-danger">Informe a data de nascimento do usuário</p></span>
                </div>
                `);
        }
        resp.write(`
            </div>
                            <!-- Botão -->
                            <div class="col-12">
                                <button class="btn btn-primary w-100" type="submit">Cadastrar</button>
                            </div>
                        </form>
                    </div>

                </body>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
            </html>`);

    }

    resp.end();
}

function chatView(req, resp) {
    const dataHoraUltimoLogin = req.cookies['dataHoraUltimoLogin'];
    if (!dataHoraUltimoLogin) {
        dataHoraUltimoLogin = '';
    }
    resp.send(`
        <html>
            <head>
                <meta charset="utf-8">
                <title>Bate-papo</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
            </head>
            <body>
                <nav class="navbar navbar-expand-lg bg-body-tertiary">
                        <div class="container-fluid">
                            <a class="navbar-brand" href="/">MENU</a>
                            <div class="collapse navbar-collapse justify-content-center" id="navbarNavAltMarkup">
                                <div class="navbar-nav">
                                    <a class="nav-link active" aria-current="page" href="/cadastrarUsuario">Cadastrar Usuário</a>
                                    <a class="nav-link active" aria-current="page" href="/chat">Chat</a>
                                    <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Seu último acesso foi realizado em ${dataHoraUltimoLogin}</a>
                                    <a class="nav-link active text-danger" aria-current="page" href="/logout">Sair</a>
                                </div>
                            </div>
                        </div>
                </nav>
                <div class="container mt-5">
                    <h1 class="text-center mb-4">Bate-papo</h1>
                    <form method="POST" action="/postarMensagem" class="mb-4">
                        <h2>Mensagens:</h2>
                        <ul class="list-group">
                        ${mensagens.map(msg => `<li class="list-group-item"><strong>${msg.usuario}</strong> <span class="text-muted">(${msg.timestamp})</span>: ${msg.mensagem}</li>`).join('')}
                        </ul>
                        <br><hr>
                        <div class="mb-3">
                            <label for="usuario" class="form-label">Usuário</label>
                            <select class="form-select w-25" id="usuario" name="usuario" required>
                                ${listaUsuarios.map(user => `<option value="${user.nome}">${user.nome}</option>`).join('')}
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="mensagem" class="form-label">Mensagem</label>
                            <textarea class="form-control" id="mensagem" name="mensagem" rows="3" required></textarea>
                        </div>
                        <div class="d-flex justify-content-center">
                        <button type="submit" class="btn btn-primary w-25">Enviar Mensagem</button>
                        </div>
                    </form>
                </div>
            </body>
        </html>
    `);
}

function postarMensagem(req, resp) {
    const { usuario, mensagem } = req.body;

    if (usuario && mensagem) {
        mensagens.push({ usuario, mensagem, timestamp: new Date().toLocaleString() });
        resp.redirect('/chat');
    } else {
        resp.redirect('/chat');
    }
}

function autenticarUsuario(req, resp) {
    const dataHoraUltimoLogin = req.cookies['dataHoraUltimoLogin'];
    if (!dataHoraUltimoLogin) {
        dataHoraUltimoLogin = '';
    }
    const usuario = req.body.usuario;
    const senha = req.body.senha;

    if (usuario === 'admin' && senha === '123') {
        req.session.usuarioLogado = true;
        resp.cookie('dataHoraUltimoLogin', new Date().toLocaleString(), { maxAge: 1000 * 60 * 60 * 24 * 30, httpOnly: true });
        resp.redirect('/');
    }
    else {
        resp.send(`
                    <html>
                        <head>
                         <meta charset="utf-8">
                         <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
                               integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
                        </head>
                        <body>
                            <div class="container w-25"> 
                                <div class="alert alert-danger" role="alert">
                                    Usuário ou senha inválidos!
                                </div>
                                <div>
                                    <a href="/login.html" class="btn btn-primary">Tentar novamente</a>
                                </div>
                            </div>
                        </body>
                        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
                                integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
                                crossorigin="anonymous">
                        </script>
                    </html>
                  `
        );
    }
}

function verificarAutenticacao(req, resp, next) {
    if (req.session.usuarioLogado) {
        next();
    }
    else {
        resp.redirect('/login.html');
    }
}

app.get('/login', (req, resp) => {
    resp.redirect('/login.html');
});

app.get('/logout', (req, resp) => {
    req.session.destroy();
    resp.redirect('/login.html');
});

app.post('/login', autenticarUsuario);
app.get('/', verificarAutenticacao, menuView);
app.get('/cadastrarUsuario', verificarAutenticacao, cadastroUsuarioView);
app.post('/cadastrarUsuario', verificarAutenticacao, cadastrarUsuario);
app.get('/chat', verificarAutenticacao, chatView);
app.post('/postarMensagem', verificarAutenticacao, postarMensagem);

app.listen(porta, host, () => {
    console.log(`Servidor iniciado e em execução no endereço http://${host}:${porta}`);
});
