// import bootstrap from "bootstrap";

export default function AddComputerButton(props) {
    const { size, onAddComputer } = props;
    const modal = document.getElementById('addComputerModal');

    function handleSubmit(e) {
        e.preventDefault();

        const body = {
            id: e.target.id.value,
            name: e.target.name.value
        }

        axios
            .post('computer', body)
            .then((response) => {
                console.log(response);
                
                onAddComputer({
                    id: body.id,
                    name: body.name,
                    inactivity: 0
                });

                const bootstrapModal = bootstrap.Modal.getInstance(modal);
                bootstrapModal.hide();
            })
            .catch((error) => {
                console.log(error);
            });
    }

    return (
        <>
            <button 
                type="button" 
                data-bs-toggle="modal"
                data-bs-target="#addComputerModal"
                className={size == 'lg' ? 'btn btn-lg btn-primary' : 'btn btn-primary'}>
                    Add computer
            </button>

            <div className="modal fade text-start" id="addComputerModal" tabIndex="-1" aria-labelledby="addComputerModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <form method="POST" onSubmit={handleSubmit}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-4" id="addComputerModalLabel">Add new computer</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="id">ID<span className="text-danger">*</span></label>
                                    <input type="text" className="form-control" id="id" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="name">Name<span className="text-danger">*</span></label>
                                    <input type="text" className="form-control" id="name" />
                                </div>
                                <div className="mb-3">
                                    <span className="text-danger">*</span> fields are required
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-danger" data-bs-dismiss="modal">Cancel</button>
                                <button type="submit" className="btn btn-primary">Add computer</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}