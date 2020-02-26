# comob-api
NodeJS Express REST API for serving Chroniques Oubliées TTRPG compendium data

## Available routes
`/dataset`
Returns the list of datasets as an array of objects

    {
    "dbid": database identifier
    "name": dataset name
    "showAbilities": [
	    { 
	    "type": ability type,
	    "label": ability type label
	    }
    ],
    "currency": currency name



<!--stackedit_data:
eyJoaXN0b3J5IjpbMTQzOTI5MTcxMiwyMjQyNjkxMDhdfQ==
-->