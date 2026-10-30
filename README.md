# Portfólio de Arthur Faria — código completo

Site estático feito em HTML, CSS e JavaScript, sem etapa de compilação e sem dependências de npm.

## Como abrir no computador

1. Extraia todo o ZIP.
2. Abra a pasta `arthur-faria-portfolio` no VS Code ou em outro editor.
3. Abra um terminal nessa pasta.
4. Se você tem Python instalado, execute:

**Windows:**

```powershell
py -m http.server 8080 --bind 127.0.0.1 --directory dist
```

**Linux ou macOS:**

```bash
python3 -m http.server 8080 --bind 127.0.0.1 --directory dist
```

5. Abra http://127.0.0.1:8080 no navegador.
6. Para encerrar o servidor, pressione Ctrl+C no terminal.

O servidor local é necessário porque os caminhos das imagens, vídeos, CSS e JavaScript começam em `/`. Abrir o HTML por duplo clique pode deixar esses recursos sem carregar. O comando acima serve a pasta correta e só aceita conexões do próprio computador.

## Onde editar

- `dist/index.html`: estrutura da página, textos principais e cards.
- `dist/styles.css`: estilo principal do site.
- `dist/refinements.css`: estilos complementares, capas e ajustes para celular.
- `dist/app.js`: filtros, abas, detalhes dos projetos, especificações jurídicas e players.
- `dist/assets/arthur-faria.png`: foto do perfil.
- `dist/assets/projects/`: as três capas em pixel art, em WebP.
- `dist/assets/demos/`: vídeos MP4 e capas das demonstrações.
- `SOURCE_NOTES.md`: fontes profissionais e critérios do conteúdo.
- `ASSET_NOTES.md`: direção visual das ilustrações.

## Conteúdo incluído

Home Credit, inspeção de garrafas PET e SENAI Exchange; vídeos do Home Credit e do SENAI Exchange; caso do agente jurídico na área de experiência, com especificações, arquitetura e critérios de qualidade. As informações jurídicas são o resumo preparado para o portfólio. O PDF corporativo integral não faz parte do site.

## Hospedagem

Para hospedar em outro serviço, a raiz que deve ser servida é `dist/`.
A autenticação e o acesso privado do endereço atual são fornecidos pela hospedagem, não por este HTML. Em outra hospedagem, configure o acesso privado antes de disponibilizar o site.

## Versão

Esta exportação corresponde à versão do código implantada em 30/10/2026.
Commit: beb5ae8321535fb8443fc6f36bc4678fa983d05c
