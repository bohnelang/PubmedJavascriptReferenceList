

//
// Javascript to build a reference list  by JavaScript and a PubMed query online
// Andreas Bohne-Lang (2021)
// Distributed by CC0 
//


function decodeEntities(encodedString) {
    return $("<div/>").html(encodedString).text();
}

function filterTag(titleString) {
    return titleString.replace("</li>", "").replace("<li>", "");
}


function getEntries(idbox,searchTerm) {

    // Query string for REST-API
    let query_string1 = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=" + searchTerm + "&retmax=100&retmode=json";
    //alert(query_string1);

    var allPublications = document.createElement('ul');

    allPublications.setAttribute("class", "pubList");

    let idString = "";
    let req = $.getJSON(query_string1, function(data) {
        if (data != null) {
            idString = data.esearchresult.idlist.join(",");
        }
    });


    req.done(function(response) {

        let query_string2 = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=" + idString + "&version=2.0&retmode=json";
        //alert(query_string2);

        $.getJSON(query_string2, function(data) {
            if (data != null && data.result && data.result.uids) {

                // Gets UIDs from JSON
                let uids = data.result.uids;

                // Reverse sorting so that the newest publications are on top of the list.
                uids.sort().reverse();

                $.each(uids, function(index, content) {
                    let value = data.result[content];
                    let authorListLength = value.authors.length;

                    // Create list elemente
                    let publicationEntry = document.createElement('li');

                    // Iterate through list of authors
                    for (i = 0; i < authorListLength - 1; i++) {
                        publicationEntry.innerHTML += value.authors[i].name;
                        if (i < authorListLength - 2) {
                            publicationEntry.innerHTML += ", ";
                        }
                    }

                    if (value.pubdate) {
                        publicationEntry.innerHTML += " (" + parseInt(value.pubdate) + ")<br>";
                    }

                    if (value.title) {
                        publicationEntry.innerHTML += decodeEntities(filterTag(value.title)) + "<br>";
                    }

                    if (value.fulljournalname) {
                        publicationEntry.innerHTML += decodeEntities(value.fulljournalname);
                    }

                    if (value.volume) {
                        publicationEntry.innerHTML += " " + value.volume;
                    }

                    if (value.issue) {
                        publicationEntry.innerHTML += "(" + value.issue + ")";
                    }

                    if (value.pages) {
                        publicationEntry.innerHTML += ": " + value.pages + "<br>";
                    }

                    $.each(value.articleids, function(index, value) {
                        if (value.idtype == "doi") {
                            publicationEntry.innerHTML += "<a href='http://dx.doi.org/" + value.value + "' target=_blank> DOI: " + value.value + "</a>  ";
                        }
                        if (value.idtype == "pubmed") {
                            publicationEntry.innerHTML += "<a href='http://www.ncbi.nlm.nih.gov/pubmed/" + value.value + "' target=_blank> PMID: " + value.value + "</a> ";
                            publicationEntry.innerHTML += "<a href='http://europepmc.org/abstract/MED/" + value.value + "' target=_blank> EuropePMC: " + value.value + "</a> ";
                        }
                    });
                    allPublications.appendChild(publicationEntry);
                });
            }
        });

        document.getElementById(idbox).appendChild(allPublications);

    });

};
