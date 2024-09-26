
function operateFormatter(value, row, index) {
    return [
        '<a class="timer-edit" href="#" title="Edit" id="edit' +
        row._id +
        '" data-toggle="modal" data-target="#dateModal" data-modal-mode="table-edit" data-rowid="' +
        row._id +
        '">',
        '<i class="far fa-edit"></i>',
        "</a>&nbsp;",
        '<a class="timer-edit" href="#" title="Delete" id="edit' +
        row._id +
        '" data-toggle="modal" data-target="#deleteEntryModal" data-rowid="' +
        row._id +
        '">',
        '<i class="far fa-trash-alt"></i>',
        "</a>"
    ].join("");
}
