## Application Details
|               |
| ------------- |
|**Generation Date and Time**<br>22/02/2024|
|**App Generator**<br>@sap/generator-fiori-freestyle|
|**App Generator Version**<br>1.7.5|
|**Generation Platform**<br>SAP Business Application Studio|
|**Floorplan Used**<br>2listdetail|
|**Service Type**<br>SAP System (ABAP On Premise)|
|**Service URL**<br>https://ndc-srvhana.opus-idc.com.br:8100/sap/opu/odata/sap/ZPSSILVA_GW_SRV
|**Module Name**<br>ZMOC_LISTDETAIL|
|**Application Title**<br>Companhias Aéreas|
|**Namespace**<br>moovi|
|**UI5 Theme**<br>sap_horizon|
|**UI5 Version**<br>1.102.8|
|**Enable Code Assist Libraries**<br>False|
|**Enable TypeScript**<br>False|
|**Add Eslint configuration**<br>False|
|**Object collection**<br>ScarrSet|
|**Object collection key**<br>Carrid|
|**Object ID**<br>Carrname|
|**entityType**<br>ScarrToSpfliNav|
|**entitySet**<br>SpfliSet|
|**Line item collection key**<br>Carrid|
|**Line item ID**<br>Cityfrom|
|**Line item number**<br>Fltime|

## ZMOC_LISTDETAIL

Template para List Detail Fiori Freestyle

### Alterando nome do template

Após clonar o repositório template é necessário realizar algumas alterações conforme abaixo:

-   No menu Search (ou CTRL + Shift + F) pesquise e substitua todas as ocorrências encontradas de **m11** para **NOME DO SEU APP**
-   No menu Search (ou CTRL + Shift + F) pesquise e substitua todas as ocorrências encontradas de **ZMOC_LISTDETAIL** para **NOME DO SEU APP** (Nome da aplicação BSP que será publicada)
-   Verifique se o nome da destination esta correto (conforme nome da destination configurado nas aulas anteriores) nos arquivos **.yaml**
-   Verifique se os nomes informados para as EntitySets e propriedade de navegação estão de acordo com os nomes que definiu em seu serviço oData nos aqruivos abaixo:
    -   **manifest.json**  - configuração de rota para a Lista principal.(aproximadamente na linha 131)
    -   **List.view.xml**  - Nome do EntitySet para lista princial (aproximadamente na linha 24) 
    -   **Detail.view.xml**  - Nome da propriedade de Navigation para os Itens (aproximadamente na linha 25) 

-   No arquivo **manifest.json** altere a url do serviço oData para o seu serviço oData:

    De:

```
"uri": "/sap/opu/odata/sap/ZPSSILVA_GW_SRV/"
```
   
   Para:

```
"uri": "/sap/opu/odata/sap/<<<ZMEUSERVICO_GW_SRV>>>/"
```

### Starting the generated app

-   This app has been generated using the SAP Fiori tools - App Generator, as part of the SAP Fiori tools suite.  In order to launch the generated app, simply run the following from the generated app root folder:

```
    npm start
```

- It is also possible to run the application using mock data that reflects the OData Service URL supplied during application generation.  In order to run the application with Mock Data, run the following from the generated app root folder:

```
    npm run start-mock
```

#### Pre-requisites:

1. Active NodeJS LTS (Long Term Support) version and associated supported NPM version.  (See https://nodejs.org)


