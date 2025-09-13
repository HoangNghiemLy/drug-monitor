let url = location.host;//so it works locally and online

$("table").rtResponsiveTables();//for the responsive tables plugin

$("#add_drug").submit(function(event){
    // Client-side validation
    const name = $("#name").val();
    const dosage = $("#dosage").val();
    const card = parseInt($("#add_drug [name='card']").val());
    const pack = parseInt($("#add_drug [name='pack']").val());
    const perDay = parseInt($("#add_drug [name='perDay']").val());
    
    let errors = [];
    
    // Validate name length
    if (name.length <= 5) {
        errors.push("Drug name must be longer than 5 characters");
    }
    
    // Validate dosage format
    const dosagePattern = /^\d{2}-morning,\d{2}-afternoon,\d{2}-night$/;
    if (!dosagePattern.test(dosage)) {
        errors.push("Dosage must follow the format: XX-morning,XX-afternoon,XX-night where X is a digit");
    }
    
    // Validate card
    if (isNaN(card) || card <= 0) {
        errors.push("Card value must be more than 0");
    }
    
    // Validate pack
    if (isNaN(pack) || pack <= 0) {
        errors.push("Pack value must be more than 0");
    }
    
    // Validate perDay
    if (isNaN(perDay) || perDay <= 0 || perDay >= 90) {
        errors.push("PerDay value must be more than 0 and less than 90");
    }
    
    if (errors.length > 0) {
        event.preventDefault();
        alert("Please fix the following errors:\n" + errors.join("\n"));
        return false;
    }
    
    alert($("#name").val() + " sent successfully!");
})

// Handle purchase days calculation
$("#drug_days").submit(function(event){
    event.preventDefault();
    const days = parseInt($("#days").val());
    
    if (isNaN(days) || days <= 0) {
        alert("Please enter a valid number of days (greater than 0)");
        return;
    }
    
    // Get all drugs data using the API
    $.ajax({
        url: `http://${location.host}/api/drugs`,
        method: "GET",
        success: function(drugs) {
            updatePurchaseTable(drugs, days);
        },
        error: function(err) {
            console.error("Error fetching drugs:", err);
            alert("Error calculating drug purchases. Please try again.");
        }
    });
});

// Function to update the purchase table with calculation
function updatePurchaseTable(drugs, days) {
    // Clear the existing table body
    $("#purchase_table tbody").empty();
    
    // Add rows for each drug
    for (let i = 0; i < drugs.length; i++) {
        const drug = drugs[i];
        const pills = days * drug.perDay;
        const cardsNeeded = Math.ceil(pills / drug.card);
        const packsNeeded = Math.ceil(pills / drug.pack);
        const cardsPerPack = drug.pack / drug.card;
        
        const row = `
            <tr>
                <td>${i + 1}</td>
                <td>${drug.name}</td>
                <td>${cardsNeeded} (${cardsPerPack} ${cardsPerPack < 2 ? 'card' : 'cards'} per pack)</td>
                <td>${packsNeeded}</td>
            </tr>
        `;
        
        $("#purchase_table tbody").append(row);
    }
    
    // Update the purchase title to show selected days
    $("#purchase_title").text(`Drug Purchase Plan for ${days} days`);
}

$("#update_drug").submit(function(event){// on clicking submit
    event.preventDefault();//prevent default submit behaviour

    //var unindexed_array = $("#update_drug");
    var unindexed_array = $(this).serializeArray();//grab data from form
    var data = {}

    $.map(unindexed_array, function(n, i){//assign keys and values from form data
        data[n['name']] = n['value']
    })
    
    // Client-side validation
    const name = data.name;
    const dosage = data.dosage;
    const card = parseInt(data.card);
    const pack = parseInt(data.pack);
    const perDay = parseInt(data.perDay);
    
    let errors = [];
    
    // Validate name length
    if (name.length <= 5) {
        errors.push("Drug name must be longer than 5 characters");
    }
    
    // Validate dosage format
    const dosagePattern = /^\d{2}-morning,\d{2}-afternoon,\d{2}-night$/;
    if (!dosagePattern.test(dosage)) {
        errors.push("Dosage must follow the format: XX-morning,XX-afternoon,XX-night where X is a digit");
    }
    
    // Validate card
    if (isNaN(card) || card <= 0) {
        errors.push("Card value must be more than 0");
    }
    
    // Validate pack
    if (isNaN(pack) || pack <= 0) {
        errors.push("Pack value must be more than 0");
    }
    
    // Validate perDay
    if (isNaN(perDay) || perDay <= 0 || perDay >= 90) {
        errors.push("PerDay value must be more than 0 and less than 90");
    }
    
    if (errors.length > 0) {
        alert("Please fix the following errors:\n" + errors.join("\n"));
        return false;
    }

    var request = {//use a put API request to use data from above to replace what's on database
    "url" : `http://${url}/api/drugs/${data.id}`,
    "method" : "PUT",
    "data" : data
}

$.ajax(request).done(function(response){
    alert(data.name + " Updated Successfully!");
window.location.href = "/manage";//redirects to index after alert is closed
    })

})

if(window.location.pathname == "/manage"){//since items are listed on manage
    $ondelete = $("table tbody td a.delete"); //select the anchor with class delete
    $ondelete.click(function(){//add click event listener
        let id = $(this).attr("data-id") // pick the value from the data-id

        let request = {//save API request in variable
            "url" : `http://${url}/api/drugs/${id}`,
            "method" : "DELETE"
        }

        if(confirm("Do you really want to delete this drug?")){// bring out confirm box
            $.ajax(request).done(function(response){// if confirmed, send API request
                alert("Drug deleted Successfully!");//show an alert that it's done
                location.reload();//reload the page
            })
        }

    })
}

if(window.location.pathname == "/purchase"){
//$("#purchase_table").hide();

$("#drug_days").submit(function(event){//on a submit event on the element with id add_drug
    event.preventDefault();//prevent default submit behaviour
    $("#purchase_table").show();
    days = +$("#days").val();
    alert("Drugs for " + days + " days!");//alert this in the browser
})

}
