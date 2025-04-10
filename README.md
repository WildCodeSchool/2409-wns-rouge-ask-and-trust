# Ask&Trust
Development of an online survey platform

## Tree structures

```shell
ask-and-trust/
├── app/
│   ├── frontend/           # Code specific to the front-end application
│   │   ├── public/         # Static files (images, index.html, etc.)
│   │   ├── src/            # Source code of the application (components, pages, styles, etc.)
│   │   ├── package.json    # Dependencies and scripts for the front
│   │   └── ...             # Other files (configuration, tests, etc.)
│   │
│   └── backend/            # Code specific to the back-end application
│       ├── src/            # Source code of the API or server
│       ├── tests/          # Unit and integration tests
│       ├── package.json    # Dependencies and scripts for the back
│       └── ...             # Other files (middlewares, configuration, etc.)
│
├── docs/                   # Project documentation (installation guide, architecture, etc.)
│
├── scripts/                # Utility scripts (deployment scripts, migration, etc.)
│
├── .gitignore              # List of files/directories to ignore by Git
├── README.md               # Overall project presentation and getting started guide
└── package.json            # Global configuration file if you are using a monorepo manager
```

## Docs

https://wildcodeschool.github.io/2409-wns-rouge-ask-and-trust/

## Technologies used

## Getting Started

```sh
npm run prepare
npx husky add .husky/pre-commit "npx lint-staged"
```

## License

This project is licensed under the GPL-2.0 license. See the [LICENSE](LICENSE) file for details.
