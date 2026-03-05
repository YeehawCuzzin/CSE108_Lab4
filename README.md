# CSE108 Lab 4 – React Calculator

Simple calculator built for **CSE108** using **React + Vite** and deployed with **GitHub Pages**.

## Live Site

https://yeehawcuzzin.github.io/CSE108_Lab4/

## Features

* Basic operations (+ − × ÷)
* Decimal input
* Repeated equals behavior
* Operator highlighting
* Clear button

## Tech

* React
* Vite
* Material UI
* GitHub Pages (GitHub Actions deployment)

## Run Locally (WSL / Ubuntu)

```bash
cd /mnt/c/Users/Krish/Downloads
unzip CSE108_Lab4-main.zip
cd CSE108_Lab4-main
npm install
npm run dev
```

Open the **Local** URL printed in the terminal (usually):

```
http://localhost:5173/
```

## Notes

`vite.config.js` uses:

```
base: "/CSE108_Lab4/"
```

so the project works correctly when deployed to GitHub Pages.
