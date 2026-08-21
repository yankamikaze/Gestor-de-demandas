# Guia de Deploy

## 1. Banco de Dados (Supabase)
1. Crie uma conta/projeto grátis em [Supabase](https://supabase.com).
2. Vá no **SQL Editor** do projeto no Supabase e rode o conteúdo do arquivo `schema.sql`.
3. Vá em **Project Settings > API** e copie:
   - Project URL (`NEXT_PUBLIC_SUPABASE_URL`)
   - anon public key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)

## 2. GitHub
1. Crie um repositório vazio no seu GitHub (ex: `gestor-demandas-ti`).
2. No seu terminal, na pasta do projeto, rode:
   ```bash
   git init
   git add .
   git commit -m "Commit inicial"
   git branch -M main
   git remote add origin SUA_URL_DO_GITHUB_AQUI
   git push -u origin main
   ```

## 3. Hospedagem (Vercel)
1. Crie uma conta na [Vercel](https://vercel.com) com o seu GitHub.
2. Clique em **Add New... > Project** e importe o repositório que você acabou de criar.
3. Antes de clicar em Deploy, vá em **Environment Variables** e adicione:
   - `NEXT_PUBLIC_SUPABASE_URL` = (sua URL copiada do Supabase)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (sua chave copiada do Supabase)
4. Clique em **Deploy**. 

Seu app estará online em poucos minutos!
