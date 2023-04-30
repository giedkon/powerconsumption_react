import { useRef } from "react";

export default function AddComputerButton(props) {
    const idInputError = useRef(null);
    const nameInputError = useRef(null);
    const serverError = useRef(null);
    const { size, onAddComputer } = props;
    const modal = document.getElementById('addComputerModal');

    function handleSubmit(e) {
        e.preventDefault();

        let error = false;
        idInputError.current.hidden = true;
        nameInputError.current.hidden = true;
        serverError.current.hidden = true;

        const body = {
            id: e.target.id.value,
            name: e.target.name.value
        }

        if (body.id == "") {
            idInputError.current.hidden = false;
            error = true;
        }

        if (body.name == "") {
            nameInputError.current.hidden = false;
            error = true;
        }

        if (error === true) return

        axios
            .post('computer', body)
            .then((response) => {
                console.log(response);
                
                onAddComputer({
                    id: body.id,
                    name: body.name,
                    inactivity: 0
                });

                /*const bootstrapModal = bootstrap.Modal.getInstance(modal);
                bootstrapModal.hide();*/
            })
            .catch((error) => {
                if (error.response.status != 201)
                {
                    serverError.current.hidden = false;
                    console.log(error);
                }
            });
    }

    return (
        <>
            <button 
                type="button" 
                data-bs-toggle="modal"
                data-bs-target="#addComputerModal"
                className={size == 'lg' ? 'btn btn-lg btn-success' : 'btn btn-success'}>
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
                                    <p ref={idInputError} className="text-danger" hidden>Id field is required</p>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="name">Name<span className="text-danger">*</span></label>
                                    <input type="text" className="form-control" id="name" />
                                    <p ref={nameInputError} className="text-danger" hidden>Name field is required</p>
                                </div>
                                <div className="mb-3">
                                    <span className="text-danger">*</span> fields are required
                                    <p className="text-warning" ref={serverError} hidden>Server error: try again later</p>
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