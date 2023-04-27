import { useEffect, useState, useRef } from "react";
import axios from "axios";
import bootstrap from "bootstrap";

export default function EditComputerButton(props) {
    const nameInputError = useRef(null);
    const serverError = useRef(null);

    const { computerId, size, handleComputerUpdate } = props;

    function handleSubmit(e) {
        e.preventDefault();

        nameInputError.current.hidden = true;
        serverError.current.hidden = true;

        const body = {
            name: e.target.name.value
        }

        if (body.name == "") {
            nameInputError.current.hidden = false;
            return;
        }

        axios
            .put(import.meta.env.VITE_API_URL + 'computer/' + computerId, body)
            .then((response) => {
                handleComputerUpdate(body.name);
                const bootstrapModal = bootstrap.Modal.getInstance(modal);
                bootstrapModal.hide();
            })
            .catch((error) => {
                if (error.response.status != 201)
                {
                    serverError.current.hidden = false;
                    console.log(error);
                }
            });

        return;
    }

    return (
        <>
            <button 
                type="button" 
                data-bs-toggle="modal"
                data-bs-target="#editComputerModal"
                className={size == 'lg' ? 'btn btn-lg btn-success' : 'btn btn-success'}>
                    Edit computer information
            </button>

            <div className="modal fade text-start" id="editComputerModal" tabIndex="-1" aria-labelledby="editComputerModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <form method="POST" onSubmit={handleSubmit}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-4" id="editComputerModalLabel">Edit computer information</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
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
                                <button type="submit" className="btn btn-primary">Edit computer</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}