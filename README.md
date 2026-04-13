<p align="center">
<a href= "https://www.fiap.com.br/"><img src="assets/logo-fiap.png" alt="FIAP - Faculdade de Informática e Administração Paulista" border="0" width=40% height=40%></a>
</p>

<br>

# CardioIA - Desafio Integrador IA entre Robôs, Sinapses e Medicina

## 👨‍🎓 Integrantes: 
- <a href="https://github.com/Vitor985-hub">Vitor Eiji</a>
- <a href="https://github.com/BPilecarte">Beatriz Pilecarte</a>
- <a href="https://github.com/yggdrasilGit">Francismar Alves</a>
- <a href="https://github.com/matheusbento04">Matheus Soares</a>
- <a href="https://github.com/AntonioBarros19">Antonio Barros</a>

## 👩‍🏫 Professores:
### Tutor(a) 
- <a href="https://www.linkedin.com/in/caique-nonato/">Caique Nonato</a>
### Coordenador(a)
- <a href="https://www.linkedin.com/in/andregodoichiovato/">André Godoi Chiochiovatto</a>

---

## 📜 Descrição

O projeto **CardioIA** consiste em um sistema em Python focado em um Desafio Integrador de Inteligência Artificial para a área da Medicina. O principal objetivo da aplicação é realizar uma triagem e sugerir diagnósticos associados a possíveis doenças cardiovasculares (como Infarto Agudo do Miocárdio, Angina Instável e Embolia Pulmonar). O sistema processa descrições textuais de sintomas fornecidas por pacientes através de um fluxo usando processamento de textos, expressões regulares e base de conhecimento simulada, calculando o percentual de similaridade de um conjunto de sintomas para determinar a qual diagnóstico mais provável a situação do paciente se encaixa. 

Juntamente com os algoritmos de identificação e processamento do Python, o projeto conta também com notebooks que exploram a modelagem e análise de dados, bases e datasets auxiliares, além de uma aplicação Front-end estática focada na experiência do usuário e interface interativa.

## 📁 Estrutura de pastas

Dentre os arquivos e pastas presentes na raiz do projeto, definem-se:

- **`.ipynb_checkpoints`**: Pasta oculta gerada pelo Jupyter Notebook mantendo as automações de saves.
- **`cardioia-app/`**: Diretório que armazena todos os códigos do Front-End da aplicação. Desenvolvido utilizando React e Vite.
- **`noticias_txt/`**: Pasta contendo arquivos em texto das informações extraídas ou usadas como exemplos de leitura.
- **`Cardioaco.ipynb`** e **`Untitled.ipynb`**: Arquivos de Jupyter Notebook utilizados para análises exploratórias, validação de regras de machine learning/sintomas e elaboração do modelo de diagnóstico passo a passo.
- **`dataset.csv`** e **`mapeamento_sintomas_e_doencas.csv`**: Bases de dados brutas e planilhas usadas pela IA e pelas análises para catalogar e extrair conhecimentos ou métricas para treinamento.
- **`frases.txt`**: Arquivo de texto simples usado como um dos "inputs" do motor Python principal para testar descrições e triagem automatizada com dezenas de relatos paralelos.
- **`main.py`**: Principal código de desenvolvimento e execução contendo a lógica central do sistema para a extração do sintoma a partir das expressões, cálculo de similaridade baseando-se em `knowledge_base` e a geração do veredito final do sistema.
- **`resultados.txt`**: Um log de saída onde será alimentado automaticamente todos os resultados de acurácia de sintomas gerados após rodar o `main.py`.
- **`README.md`**: arquivo que serve como guia e explicação geral sobre o projeto (o mesmo que você está lendo agora).

## 🔧 Como executar o código

A plataforma não demanda instalações complexas. Apenas garanta que as ferramentas básicas estejam prontas:

1. **Pré-requisitos**:
   - Ter o Python (versão 3.x) instalado em sua máquina.
   - Ter o Node.js (versão 16.x ou superior) instalado em sua máquina.
   
2. **Execução do Motor Python (Processador de Textos)**:
   - Alimente o arquivo `frases.txt` na raiz do diretório com os relatos em texto das dores/sintomas dos pacientes. Coloque uma frase por linha.
   - Abra o terminal de sua preferência dentro da pasta do projeto.
   - Execute o comando principal:
     ```bash
     python main.py
     ```
   - Verifique a saúde dos processamentos e as assertividades dos diagnósticos abrindo o arquivo `resultados.txt` gerado automaticamente da execução.

3. **Executando a interface Web**:
   - Abra o terminal de sua preferência.
   - Navegue até a pasta do Front-End:
     ```bash
     cd cardioia-app
     ```
   - Instale as dependências (necessário apenas na primeira vez):
     ```bash
     npm install
     ```
   - Inicie o servidor de desenvolvimento:
     ```bash
     npm run dev
     ```
   - O aplicativo estará acessível no seu navegador, geralmente no endereço `http://localhost:5173`.

## 🗃 Histórico de lançamentos

- 0.1.0 - 12/04/2026
    * Lançamento Inicial do protótipo com algoritmo de sintomas.

## 📋 Licença

[MODELO GIT FIAP](https://github.com/agodoi/template) por [Fiap](https://fiap.com.br) está licenciado sobre [Attribution 4.0 International](http://creativecommons.org/licenses/by/4.0/?ref=chooser-v1).