# ES2

Comandos para criar projetos em VS Code
**Criar pasta out/ com os ficheiros necessários para criar o executável**

1. Através do terminal, aceder à pasta principal
2. Executar os comandos:
mkdir out
javac -d out (Get-ChildItem -Recurse -Filter *.java src | ForEach-Object FullName)

**Criar o executável**
1. Executar o comando:
jar --create --file _<Nome do ficheiro>.jar_ --main-class _<package>_ -C out .
OU 
jar --create --file _<Nome do ficheiro>.jar_ -C out .

exemplo: 
jar --create --file FactoryPattern.jar --main-class com.es2.factorymethod.Main -C out .