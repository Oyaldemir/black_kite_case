$(document).ready(function () {
    init();
});

const init = () => {
    appendModal();
    onClickActions();
}

const onClickActions = () => {
    //Modal next button
    $(document).on("click", "#modalFramework .btn_next", function () {
        if (validations()) {
            $(".stepper span").toggleClass("active");
        }
    });

    //Modal prev button
    $(document).on("click", "#modalFramework .btn_prevStep", function () {
        $(".step_2").hide();
        $(".step_1").show();
        $(".stepper span").removeClass("active");
    });

    //Modal edit button
    $(document).on("click", ".action_buttons .edit", function () {
        $(this)
            .addClass("added")
            .removeClass("edit")
            .empty()
            .append(`<img src="../../assets/img/check-2.png" width="12" height="12" />`);
    });
    $(document).on("click", ".action_buttons .added", function () {
        $(this)
            .addClass("edit")
            .removeClass("added")
            .empty()
            .append(`<img src="../../assets/img/edit.png" width="12" height="12" />`);
    });

    //Modal on close
    $(document).on('hidden.bs.modal', "#modalFramework", function () {
        resetModalData();
    });
}

const validations = () => {
    let name = $("#modalFramework #name").val();
    let short_name = $("#modalFramework #short_name").val();
    let description = $("#modalFramework #description").val();

    if (!name || !short_name || !description) {
        if (!name) {
            $(`#modalFramework #name`).parent().addClass("novalid");
        }
        if (!short_name) {
            $(`#modalFramework #short_name`).parent().addClass("novalid");
        }
        if (!description) {
            $(`#modalFramework #description`).parent().addClass("novalid");
        }

        return false;
    }
    else {
        generateTable();
        $("#modalFramework").find(".novalid").removeClass("novalid");
        $(".step_1").hide();
        $(".step_2").show();

        return true;
    }
}

const resetModalData = () => {
    $("#modalFramework").find(".novalid").removeClass("novalid");
    $(".stepper span").removeClass("active");
    $(".step_1").show();
    $(".step_2").hide();
    $("#modalFramework #name").val("");
    $("#modalFramework #short_name").val("");
    $("#modalFramework #description").val("");
}

const appendModal = () => {
    let width = $(window).width();
    $("body").append(`
        <div class="modal fade" id="modalFramework" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg custom_modal_lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <div>
                            <h5>
                                Add New Framework
                                <span>1/3</span>
                            </h5>
                            <p>Please fill in the details of he new framework.</p>
                        </div>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="stepper">
                            <span class="default">
                                <span>01</span>
                                <p>Framework Details</p>
                            </span>
                            <span class="line"></span>
                            <span class="">
                                <span>02</span>
                                <p class="right">Control Items</p>
                            </span>
                        </div>
                        <div class="step_1">
                            <div class="info_bar">
                                <p>You can 1 Enterprice Framework license available.</p>
                            </div>
                            <div class="form">
                                <div class="d-flex">
                                    <div class="child">
                                        <label for="name">Name *</label>
                                        <input id="name" type="text" class="form-control" placeholder="Enter name">
                                    </div>
                                    <div class="child">
                                        <label for="short_name">Short Name *</label>
                                        <input id="short_name" type="text" class="form-control"
                                            placeholder="Enter short name">
                                    </div>
                                </div>
                                <div class="file_upload">
                                    <label for="select_logo">Upload framework logo</label>
                                    <input id="select_logo" type="file" class="form-control d-none"
                                        placeholder="Upload framework logo">
                                </div>
                                <div>
                                    <div class="w-100">
                                        <label for="description">Description *</label>
                                        <textarea id="description" name="description" rows="3" cols="40"
                                            placeholder="Please add description"></textarea>
                                    </div>
                                </div>
                                <div class="file_upload_second">
                                    <label>Upload template</label>
                                    <div class="d-flex mt-2">
                                        <span class="btn_select">Select</span>
                                        <span class="input_file"></span>
                                    </div>
                                    <input id="select_template" type="file" class="form-control d-none"
                                        placeholder="Select File">
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn_cancel" data-dismiss="modal">Close</button>
                                <button type="button" class="btn btn_next">Next > Control Items</button>
                            </div>
                        </div>
                        <div class="step_2" style="display: none;">
                            <div class="control_list_container"></div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn_cancel" data-dismiss="modal">Close</button>
                                <button type="button" class="btn btn_prevStep">Previous Step</button>
                                ${width > 991 ? `<button type="button" class="btn btn_addControl">+ Add Control Items</button>` : ``}
                                <button type="button" class="btn btn_save">Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `);
}

function generateTable() {
    let width = $(window).width();
    let returnHTML = "";
    window.useState.controlList.forEach((e, index) => {
        returnHTML += `
                <tr class="${index % 2 == 0 ? "odd" : "even"} ${e.id}">
                    <td>${e.controlId}</td>
                    <td>${e.category}</td>
                    ${width > 991 ? `<td>${e.description}</td>` : ``}
                    <td>
                        <div class="action_buttons">
                            <span class="edit">
                                <img src="../../assets/img/edit.png" width="12" height="12" />
                            </span>
                            <span class="delete">
                                <img src="../../assets/img/delete.png" width="12" height="12" />
                            </span>
                        </div>
                    </td>
                </tr>
        `;
    });

    $(".control_list_container").addClass("justify-start");
    $(".control_list_container").empty();
    $(".control_list_container").append(
        `<table id="controlListTable" data-page-lengthX='15' class="stripe" aria-describedby="example_info" style="width: 100%;">
            <thead>
                <tr>
                    <th class="sorting sorting_asc" tabindex="0" aria-controls="example" rowspan="1" colspan="1"
                         aria-sort="ascending" aria-label="Name: activate to sort column descending">
                        Control ID
                    </th>
                    <th class="sorting" tabindex="0" aria-controls="example" rowspan="1" colspan="1"
                        aria-label="Position: activate to sort column ascending">Control Category</th>
                    ${width > 991 ? ` <th class="sorting" tabindex="0" aria-controls="example" rowspan="1" colspan="1" aria-label="Office: activate to sort column ascending">Control Description</th>` : ``}
                    <th class="sorting" tabindex="0" aria-controls="example" rowspan="1" colspan="1"
                        aria-label="Office: activate to sort column ascending">Actions</th>
                </tr>
            </thead>
            <tbody>
                ${returnHTML}
            </tbody>
        </table>`
    );

    if (width > 991) {
        $('#controlListTable').dataTable({
            responsive: true,
            bAutoWidth: false,
            aoColumns: [
                { sWidth: '10%' },
                { sWidth: '15%' },
                { sWidth: '70%' },
                { sWidth: '5%' },
            ],
            "order": [],
            paging: false,
            "info": false,
            "sorting": false,
            "ordering": false,
            "searching": false,
            "columnDefs": [
                {
                    "targets": 2,
                    render: function (data, type, row) {
                        return '<span style="white-space:break-spaces">' + data + "</span>";
                    }
                }
            ]
        });
    }
    else {
        $('#controlListTable').dataTable({
            responsive: true,
            bAutoWidth: false,
            aoColumns: [
                { sWidth: '40%' },
                { sWidth: '45%' },
                { sWidth: '5%' },
            ],
            "order": [],
            paging: false,
            "info": false,
            "sorting": false,
            "ordering": false,
            "searching": false
        });
    }
}

const toggleModal = () => {
    window.useState.modalFramework = !window.useState.modalFramework;
}