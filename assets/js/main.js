const statusList = {
    1: "one",
    2: "two",
    3: "three",
    4: "four",
    5: "five",
    6: "six"
}

const statusNameList = {
    1: "Ready to Map",
    2: "Mapping in Progress",
    3: "Ready to Publish",
    4: "Mapping Failed",
    5: "Published",
    6: "Deactivated"
}

var controlList, frameworkList, useState;

async function init() {
    globalOnchangeHandler();
    await getList(true);
    onClickActions();

    window.isExecuted = true;
}

function globalOnchangeHandler() {
    const handler = {
        set(obj, prop, value) {
            if (prop === 'modalFramework') {
                $("#modalFramework").modal(value === true ? 'show' : 'hide');

                if (value !== true) {
                    $("#modalFramework").find(".novalid").removeClass("novalid");
                }
            }
            else if (prop === 'frameworkList' && window.isExecuted) {
                getList(false, value);
            }
            return Reflect.set(...arguments)
        }
    };
    window.useState = new Proxy(window, handler);
}

function onClickActions() {
    $(".framework_card").on("click", function () {
        let shortName = $(this).find(".short_name").text();
        $(".selected_framework").text(": " + shortName);

        $(".breadcrumbs .main_page").addClass("active");
        $(".breadcrumbs .main_page").next().remove();
        $(".breadcrumbs .main_page").after("<span> <span class='arrow'>></span> " + shortName + "</span>");

        generateTable($(this).attr("custom-id"));
        $(".framework_card").removeClass("active");
        $(this).addClass("active");
    });
}

function getList(isFirst, value = null) {
    return new Promise((resolve, reject) => {
        if (isFirst) {
            fetch("../../data/data.json")
                .then(res => res.json())
                .then(data => {
                    data.frameworks.forEach(el => {
                        addFramework(el, "append");
                    });

                    window.useState.frameworkList = data.frameworks;
                    window.useState.controlList = data.controls;
                    resolve(true);
                })
                .catch(err => {
                    reject(err);
                    console.log(err);
                });
        }
        else {
            let tempValue = value || window.useState.frameworkList;
            $(".framework_list").empty();
            tempValue.forEach(el => {
                addFramework(el, "append");
            });
        }
    });
}

function addFramework(el, type) {
    let returnHTML = `<div class="framework_card" custom-id="${el.id}">
                            <div class="framework_left">
                                <img src="./assets/img/${el.logo}" />
                                <div class="framework_title">
                                    <p class="type">${el.type == 1 ? "Custom Framework" : "System Framework"}</p>
                                    <div>
                                        <p class="short_name">${el.short_name}</p>
                                        <p class="name">${el.name}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="framework_status ${statusList[el.status] || ''}">
                                <p>${statusNameList[el.status] || ''}</p>
                            </div>
                        </div>`;

    if (type === "append")
        $(".framework_list").append(returnHTML);
    else
        $(".framework_list").append(returnHTML);
}

function generateTable(frameworkID) {
    let width = $(window).width();
    let selectedElem = window.useState.frameworkList.find(el => el.id == frameworkID),
        selectedControlList = selectedElem.controlList;

    let returnHTML = "";
    selectedControlList.forEach((e, index) => {
        let selectedControl = window.useState.controlList.find(el => el.id == e);
        returnHTML += `
                <tr class="${index % 2 == 0 ? "odd" : "even"}">
                    <td>${selectedControl.controlId}</td>
                    <td>${selectedControl.category}</td>
                    ${width > 991 ? `<td>${selectedControl.description}</td>` : ``}
                </tr>
        `;
    });

    $(".table_container").addClass("justify-start");
    $(".table_container").empty();
    $(".table_container").append(
        `<table id="myTable" data-page-lengthX='15' class="display nowrap dataTable dtr-inline collapsed" aria-describedby="example_info" style="width: 100%;">
            <thead>
                <tr>
                    <th class="sorting sorting_asc" tabindex="0" aria-controls="example" rowspan="1" colspan="1"
                         aria-sort="ascending" aria-label="Name: activate to sort column descending">
                        Control ID
                    </th>
                    <th class="sorting" tabindex="0" aria-controls="example" rowspan="1" colspan="1"
                        aria-label="Position: activate to sort column ascending">Control Category</th>
                        ${width > 991 ? `<th class="sorting" tabindex="0" aria-controls="example" rowspan="1" colspan="1"
                        aria-label="Office: activate to sort column ascending">Control Description</th>` : ``}
                </tr>
            </thead>
            <tbody>
                ${returnHTML}
            </tbody>
        </table>`
    );



    if (width > 991) {
        let table = new DataTable('#myTable', {
            responsive: true,
            bAutoWidth: false,
            aoColumns: [
                { sWidth: '10%' },
                { sWidth: '15%' },
                { sWidth: '75%' },
            ],
            "order": [],
            "oLanguage": {
                "sSearch": "Search"
            }
        });
    }
    else {
        let table = new DataTable('#myTable', {
            responsive: true,
            bAutoWidth: false,
            aoColumns: [
                { sWidth: '40%' },
                { sWidth: '60%' },
            ],
            "order": [],
            "oLanguage": {
                "sSearch": "Search"
            }
        });
    }

}

$(document).ready(function () {
    init();
});