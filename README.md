# comob-api
NodeJS Express REST API for serving Chroniques Oubliées TTRPG compendium data

## Available routes

    /dataset

Returns the list of datasets

    /types/paths/:ds
    
Returns the list of paths types for a given dataset (:ds)

    /types/abilities/:ds

Returns the list of ability types for a given dataset (:ds)

    /families/:ds

Returns the list of profile families for a given dataset (:ds)

/profiles/:ds
Returns the list of all profiles for a given dataset (:ds)
/profiles/:ds?family=:family1,:family2
Returns the list of profiles for a given dataset (:ds) and the given family ids (:f
<!--stackedit_data:
eyJoaXN0b3J5IjpbNzc3MzczMjYyLDE5OTgzOTAwMCwtMTA4OD
M0Njg4MCwxMzg5MzI0MTc4LDIyNDI2OTEwOF19
-->