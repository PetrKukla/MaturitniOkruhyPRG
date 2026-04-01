# 🎓 Maturitní příprava PRG

Interaktivní webový portál pro přípravu k maturitní zkoušce z programování. Projekt slouží k procvičování 25 maturitních okruhů pomocí AI generovaného obsahu, kvízů a praktických úloh.

🔗 **Live verze:** [https://benesondrej.github.io/MaturitniOkruhyPRG/index.html](https://benesondrej.github.io/MaturitniOkruhyPRG/index.html)

---

## 🛠️ Architektura projektu

Projekt je rozdělen do tří hlavních částí pro snadnou údržbu:
- `index.html`: Čistá struktura a layout aplikace.
- `style.css`: Moderní "dark mode" design a responzivita.
- `app.js`: Logika aplikace, ovládání tabů a vykreslování dat.
- `data.json`: **Hlavní databáze obsahu.**

---

## ✍️ Jak upravovat a tvořit obsah

Veškerý obsah (texty, otázky v kvízu, flashcardy) je uložen v souboru `data.json`. Pokud chceš něco změnit, upravuješ pouze tento soubor.

### Struktura jednoho okruhu v JSON:
Každý okruh je definován svým indexem a obsahuje tyto sekce:

```json
"1": {
  "explain": {
    "sections": [
      {
      "title": "Název sekce",
      "content": "Text s <p> a <code> tagy."
      }
    ]
  },
  "quiz": [
    {
      "q": "Znění otázky?",
      "options": ["A", "B", "C", "D"],
      "correct": 0,
      "feedback": "Vysvětlení, proč je to takhle."
    }
  ],
  "tasks": [
    {
      "title": "Úkol 1",
      "desc": "Zadání...",
      "hint": "Nápověda..."
    }
  ],
  "codefill": [
    {
      "title": "Doplnění kódu",
      "desc": "Popis úkolu",
      "template": "int x = ___0___;",
      "options": ["5", "10", "15", "20"] // Nepovinné
      "answers": {
        "0": "10"
      }
    }
  ],
  "flashcards": [
    {
      "term": "Pojem",
      "def": "Definice pojmu"
    }
  ]
}
```

## 🤝 Jak přispět (Workflow)

Chceš přidat nový okruh nebo opravit chybu? Postupuj podle tohoto návodu:

### 1. Forkni si repozitář
Klikni na tlačítko **Fork** v pravém horním rohu tohoto repozitáře. Tím si vytvoříš vlastní kopii projektu ve svém účtu.

### 2. Klonování do PC
Otevři terminál (nebo Git Bash) a stáhni si svou kopii k sobě:
```bash
git clone https://github.com/TVOJE-JMENO/MaturitniOkruhyPRG.git
cd MaturitniOkruhyPRG
```

### 3. Vytvoření větve (Branch)

Nikdy neupravuj přímo hlavní větev main. Pro každou novou funkci nebo opravu si vytvoř vlastní větev. To zajistí, že hlavní kód zůstane vždy funkční a přehledný.

```bash
git checkout -b feature/nazev-tvoji-zmeny
```

### 4. Úprava souborů

Proveď potřebné změny.

- Tip: Pokud upravuješ data.json, doporučuji po uložení zkontrolovat validitu souboru (např. přes JSONLint), ať předejdeš chybám při načítání celého webu.

### 5. Commit a Push

Jakmile máš hotovo, ulož změny do Gitu a pošli je do svého forku na GitHubu:

```bash
git add .
git commit -m "Doplnění otázek pro okruh 14 a úprava CSS tabulky"
git push origin nazev-tvoji-zmeny
```

### 6. Pull Request (PR)

Běž na stránku tvojeho forku na GitHubu.

GitHub sám rozpozná novou větev a zobrazí žlutý panel s tlačítkem "Compare & pull request".

Klikni na něj, napiš krátký komentář k tomu, co jsi změnil, a odešli.