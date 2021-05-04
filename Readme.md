# Pubmed Reference List by JavaScript

This small JavaScript generates a reference list from a PubMed query directly.


## For example: Search by author: "Bohne-Lang"[AU]
```
<div id="LitList"></div>
<script type="application/javascript"> $(document).ready(function() { getEntries('LitList','(Medical Faculty Mannheim[AD])') ;});</script>
```

![example](https://raw.githubusercontent.com/bohnelang/PubmedJavascriptReferenceList/main/example1.jpg)

## Code
The structure of the code is quite simple
* Fetch PubMed online by a 'normal' query against the RESTful API of the eUtils 
* Get a list of IDs in JSON format
* Compute a new query for each ID
* Get a record with details of this publication
* Render this publication details in HTML and add a new entry on-the-fly to DOM

## Other queries:
See https://pubmed.ncbi.nlm.nih.gov/help/#search-tags for details.

* by ID: 15982415,15784146[ID]
* by Affiliation (Medical Faculty Mannheim[AD])
![example](https://raw.githubusercontent.com/bohnelang/PubmedJavascriptReferenceList/main/example2.jpg)
