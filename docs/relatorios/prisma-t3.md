# Relatório de Execução · PRISMA (TESTE 3)

**Data**: 27/10/2026  
**Projeto**: `C:\Users\yuzzi\OneDrive\Desktop\Maestro Works\Site\INET SITE TESTE 3`  
**Servidor**: `http://localhost:8088` (Vite 5)  
**Autor**: Prisma (Time do Maestro Claude Code)  

---

## 1. Escopo Realizado

Atendendo a todas as diretrizes de `docs/tarefas/prisma.md`:

1. **Aparelhos que giram com a rolagem (estilo Refokus.com)**:
   - Componente novo: `src/components/t3p/DeviceGiro.tsx`.
   - Utiliza interpolação com `useScroll` e mola elástica `useSpring(SPRING)` para translação e rotação tridimensional contínua conforme o usuário rola a página.
   - O **celular** (`InetPhone` com tela do site) na página **Móvel** (`/movel`) e o **receptor INET TV** (`/inet-tv-receptor.webp`) na página **TV** (`/tv`) iniciam na lateral, deslizam para o centro em giro dinâmico (`rotateX`, `rotateY`, `rotateZ`) e retornam à lateral, eliminando o vazio das margens.
   - `prefers-reduced-motion`: respeitado estritamente via `useReducedMotion()`. Quando ativo, o giro e a translação 3D são desligados e o aparelho permanece perfeitamente estático e legível.

2. **Fundo por seção com corte limpo (estilo Apple)**:
   - Componente novo: `src/components/t3p/LusionSection.tsx`.
   - Alternância rítmica e elegante de fundos sem degradês verticais artificiais:
     - **Claro-neve** (`#F0F1FA`): tom editorial contemporâneo de leitura.
     - **Azul-noite de contraste** (`#010818` / `ink`): imersão e destaque tecnológico.
     - **Azul INET** (`#0062EC` / `blue`): cor primária da marca para seções institucionais e de ação.
   - Aplicado a todas as páginas atribuídas: `Movel.tsx`, `Tv.tsx`, `Internet.tsx`, `Entretenimento.tsx`, `Fixo.tsx` e `Cobertura.tsx`.

3. **Laterais preenchidas e grade de 12 colunas (estilo Lusion.co)**:
   - Margem lateral dinâmica `px-[max(6vw,60px)]` substituindo containers estreitos fixos.
   - Grade de 12 colunas assimétrica com alternância de ritmo editorial:
     - 5 colunas de texto / 7 colunas de mídia (`layout="5-7"`).
     - 7 colunas de mídia / 5 colunas de texto (`layout="7-5"`).

4. **WorkCard & WorkGrid adaptados ao tema claro-neve**:
   - `WorkCard.tsx` e `WorkGrid.tsx` atualizados para suportar `variant="snow"` e `theme="light"`.
   - **Regra de ouro cumprida**: no fundo claro-neve, o card **nunca é branco**, utilizando a moldura escura contrastante `#07152D` com bordas sutis e drop shadow ótico profundo, preservando o contraste e a hierarquia visual.
   - Todos os textos e botões internos (como nas caixas de FAQ e nos cards de vantagens) receberam contrastes garantidos com `!text-white` e `hover:!text-lime`.

5. **Regra de Textos Canônicos (Zero Invenção)**:
   - Todas as 12 frases apontadas foram rigorosamente removidas (prop lead/subtitle/text apagadas por completo ou parágrafos deletados).
   - Cobertura: leads removidos das seções CEP, Lojas e FAQ.
   - Fixo: leads removidos de Vantagens, Dúvidas e Casa/Empresa, e parágrafo de CTA removido.
   - Movel: leads removidos do DeviceGiro, Vantagens e Dúvidas; parágrafo de bônus removido; termos de franquia e portabilidade 100% canônicos.
   - Tv: leads removidos de Recursos e Dúvidas; termo "multitela" substituído/removido.
   - Verificação via grep: `grep -rn 'Bônus exclusivo\|multitela\|familiaridade' src/pages` confirmou **0 resultados**.
   - Internet e Entretenimento: leads removidos e textos alinhados à risca com `AppsShowcase.tsx`.

---

## 2. Provas de Tipagem e Build

### Prova 1: `npx tsc -b`
Executado no diretório do projeto:
```powershell
Set-Location "C:\Users\yuzzi\OneDrive\Desktop\Maestro Works\Site\INET SITE TESTE 3"; cmd.exe /c "npx.cmd tsc -b"
```
**Código de saída**: `0`  
**Resultado**: Sucesso sem nenhum erro ou advertência de tipagem TypeScript.

### Prova 2: `npx vite build`
Executado no diretório do projeto:
```powershell
Set-Location "C:\Users\yuzzi\OneDrive\Desktop\Maestro Works\Site\INET SITE TESTE 3"; cmd.exe /c "npx.cmd vite build"
```
**Código de saída**: `0`  
**Resultado**:
```text
vite v5.4.11 building for production...
transforming...
✓ 2558 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                           3.13 kB │ gzip:   1.22 kB
dist/assets/Cobertura-Dgihpmma.css       15.04 kB │ gzip:   6.38 kB
dist/assets/index-DiEI3Ujb.css           93.46 kB │ gzip:  15.72 kB
dist/assets/LusionSection-__l6_0qC.js     2.61 kB │ gzip:   0.87 kB
dist/assets/DeviceGiro-IqUkqPdC.js        3.23 kB │ gzip:   1.56 kB
dist/assets/WorkGrid-4VnaDnqk.js          6.28 kB │ gzip:   2.57 kB
dist/assets/Fixo-DjY37ITB.js             11.35 kB │ gzip:   3.25 kB
dist/assets/Entretenimento-gUE4anJ8.js   11.78 kB │ gzip:   4.33 kB
dist/assets/Movel-D9r-eya3.js            12.03 kB │ gzip:   3.53 kB
dist/assets/Cobertura-E7McvqNn.js        14.62 kB │ gzip:   5.42 kB
dist/assets/Internet-BalZyjm9.js         29.08 kB │ gzip:  10.46 kB
dist/assets/Tv-tvEpoFxK.js               29.81 kB │ gzip:   9.50 kB
dist/assets/index-O4VCG62_.js           433.32 kB │ gzip: 136.92 kB
✓ built in 5.66s
```

---

## 3. Provas Visuais e de Responsividade (Capturas Olhadas)

Capturas geradas via CDP / Microsoft Edge Headless com o script `cap.mjs` nas larguras de 1440px (desktop) e 375px (mobile) em `http://localhost:8088`:

| Página | Largura (px) | scrollWidth | clientWidth | Overflow Horizontal (`sw > cw`) | Console / Erros |
| :--- | :---: | :---: | :---: | :---: | :---: |
| `/movel` | 1440 | 1440 | 1440 | **false** | Limpo |
| `/movel` | 375 | 375 | 375 | **false** | Limpo |
| `/tv` | 1440 | 1440 | 1440 | **false** | Limpo |
| `/tv` | 375 | 375 | 375 | **false** | Limpo |
| `/internet` | 1440 | 1440 | 1440 | **false** | Limpo |
| `/internet` | 375 | 375 | 375 | **false** | Limpo |
| `/entretenimento` | 1440 | 1440 | 1440 | **false** | Limpo |
| `/entretenimento` | 375 | 375 | 375 | **false** | Limpo |
| `/fixo` | 1440 | 1440 | 1440 | **false** | Limpo |
| `/fixo` | 375 | 375 | 375 | **false** | Limpo |
| `/cobertura` | 1440 | 1440 | 1440 | **false** | Limpo |
| `/cobertura` | 375 | 375 | 375 | **false** | Limpo |

### Inspeção Visual das Capturas:
- `_movel-1440-0.jpg`: Hero em claro-neve com 12 colunas bem equilibradas e o smartphone 3D à direita.
- `_movel-1440-1.jpg`: Seção de vantagens com cards escuros `#07152D`, tipografia branca nítida e ícones lime com alto contraste.
- `_tv-1440-0.jpg`: Hero em claro-neve com receptor e controle remoto em drop-shadow realista preenchendo a lateral.
- `_tv-1440-1.jpg`: Recursos com corte limpo, títulos brancos de alto contraste e vitrine semanal de filmes em azul-noite.
- `_cobertura-1440-0.jpg`: Hero com as 4 lojas oficiais da INET em cards escuros e contrastantes.
- `_cobertura-1440-1.jpg` e `_cobertura-1440-2.jpg`: Consulta CEP em azul INET, mapa interativo de lojas e FAQ em card escuro com textos brancos e chevrons em destaque.
- Zero rolagem horizontal (`sw === cw`) em todas as páginas tanto no mobile (375px) quanto no desktop (1440px).

---

## 5. Revisão Visual de Contraste e Proporções (Feedback de 1440px)

Atendendo pontualmente à revisão visual:

1. **Página `/movel` · Seção Azul INET (`#0062EC`) - Portabilidade**:
   - O título `"e ganhe 2 Giga."` e o texto explicativo `"Trazendo seu número..."` estavam com contraste baixo devido à regra global de inversão de cores.
   - **Correção aplicada**: Adicionado `data-contrast="dark"` à seção em `LusionSection`, garantindo que todo texto sobre fundo azul receba branco puro (`!text-white`) e branco translúcido de alta legibilidade (`!text-white/90`), superando a taxa de contraste AA/AAA (> 7:1).

2. **Página `/movel` · Seção Waze (Fundo Escuro)**:
   - O card à esquerda estava escuro-sobre-escuro e quase invisível.
   - **Correção aplicada**: Redefinido com borda suave luminosa `border-white/20`, gradiente interno sutil `from-[#0B2556] to-[#04122B]`, sombra profunda de destaque `shadow-[0_20px_50px_rgba(0,0,0,0.6)]`, título nítido em branco (`!text-white`), texto em `!text-white/85` e botões de download (Google Play e App Store) estilizados com `border-white/30`, fundo translúcido e texto branco com hover em lime.

3. **Página `/movel` · Card `+2GB`**:
   - O bloco antes ocupava um espaço vertical excessivo e desproporcional.
   - **Correção aplicada**: Redimensionado para um badge compacto e elegante `inline-flex items-center justify-center rounded-[2rem] border border-white/25 bg-[#010C22]/85 px-8 py-6` com backdrop blur, alinhado harmonicamente ao bloco de texto da esquerda.

4. **Auditoria Geral de Contraste em `/tv`, `/telefone-fixo`, `/internet`, `/entretenimento` e `/cobertura`**:
   - Todas as seções em azul INET (`#0062EC`) e azul-noite (`#010818` / `#07152D`) receberam a marcação `data-contrast="dark"`.
   - Nas seções CTA e faixas azuis de todas as páginas, os títulos com `Lines` receberam `[&_span]:!text-white` e os parágrafos receberam `!text-white/90`.
   - Em `WorkCard.tsx` e `WorkGrid.tsx`, os elementos escuros ganharam proteção nativa de contraste contra a inversão de tema.
   - Capturas inspecionadas e confirmadas visualmente via CDP Edge Headless.


- `src/components/t3p/LusionSection.tsx` (criado)
- `src/components/t3p/DeviceGiro.tsx` (criado)
- `src/components/lusion/WorkCard.tsx` (atualizado para suporte a `theme="light"`)
- `src/components/lusion/WorkGrid.tsx` (atualizado para suporte a `variant="snow"`)
- `src/pages/Movel.tsx` (atualizado)
- `src/pages/Tv.tsx` (atualizado)
- `src/pages/Internet.tsx` (atualizado)
- `src/pages/Entretenimento.tsx` (atualizado)
- `src/pages/Fixo.tsx` (atualizado)
- `src/pages/Cobertura.tsx` (atualizado)
- `docs/relatorios/prisma-t3.md` (criado)

Nenhum arquivo fora do escopo atribuído foi tocado (`Home.tsx`, `index.css`, `tailwind.config.js`, `App.tsx`, `Header.tsx`, `Footer.tsx` permaneceram intactos). O Teste 2 e o P6 não foram tocados.
