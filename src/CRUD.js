import React, {useState, useEffect, Fragment} from "react";
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import axios from "axios";
import {ToastContainer, toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './CRUD.css';

const CRUD = ()=> {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [taskTitle, setTaskTitle] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [taskID, setTaskID] = useState('');
    // const [taskStatus, setTaskStatus] = useState('');

    const [editTaskTitle, setEditTaskTitle] = useState('');
    const [editTaskDescription, setEditTaskDescription] = useState('');
    const [editTaskStatus, setEditTaskStatus] = useState('');   


    const [data, setData] = useState([]);
    useEffect(()=>{
        getData();
    },[]);

    const getData = () =>{
       // axios.get('https://localhost:44327/api/taskAPI/get_task_list')
       fetch('https://localhost:44327/api/taskAPI/get_task_list')
        .then((res)=>res.json())        
        .then((data)=>{
            setData(data.return_set_01_data);
           console.log(data.return_set_01_data)
        })
        .catch((err)=>{
            console.log(err);
        })

    }

    const handleEdit=(taskID)=>{
        handleShow();
        axios.get(`https://localhost:44327/api/taskAPI/get_task_list_by_taskID?taskID=${taskID}`)
        .then((res)=>{
            setEditTaskTitle(res.data.return_set_01_data.taskTitle)
            setEditTaskDescription(res.data.return_set_01_data.taskDescription)
            setEditTaskStatus(res.data.return_set_01_data.taskStatus)
        })
    }


    const handleDelete = (taskID)=>{
        if(window.confirm("Are you sure you want to delete this") == true){
            axios.delete(`https://localhost:44327/api/taskAPI/delete_task?taskID=${taskID}`)
            .then((res)=>{
                console.log(res);
                if (res.status_code === 200){
                    toast.success('Task has been deleted successfully')
                }
                getData();
            })
            .catch((err)=>{
                toast.error(err);
            })
        }        
    }

    const handleUpdate = ()=>{
        const url =`https://localhost:44327/api/taskAPI/update_task?taskID=${taskID}`
        const data = {
            "taskID": setTaskID,
            "taskTitle": editTaskTitle, 
            "taskDescription": editTaskDescription,
            "taskStatus": editTaskStatus
        }
        axios.put(url, data)
        .then((res)=>{
            handleClose();
            getData();
            clear();
            toast.success('Task has been updated successfully');
        })
        .catch((err)=>{
            toast.error(err);
        })

        const clear = () =>{
            setTaskTitle('');
            setTaskDescription('');
            setEditTaskTitle('');
            setEditTaskDescription('');
            setEditTaskStatus('');
        };

    }

    const handleSave = ()=>{
        const url ='https://localhost:44327/api/taskAPI/create_task'
        const data = {
                "taskTitle": taskTitle, 
                "taskDescription": taskDescription
        }

        axios.post(url, data)
        .then((res)=>{
            getData();
            clear();
            toast.success('Task has been added successfully');
        })
        .catch((err)=>{
            toast.error(err);
        })

        const clear = () =>{
            setTaskTitle('');
            setTaskDescription('');
            setEditTaskTitle('');
            setEditTaskDescription('');
            setEditTaskStatus('');
        };
    }
    return (
    <Fragment className="taskFrag">        
        <ToastContainer />
            <Container className="mt-5 d-flex justify-content-center" >                        
                <Row>
                    <Col>
                        <input type="text" className="form-control" placeholder="Edit Task Title"  
                        value={taskTitle} onChange={(e)=> setTaskTitle(e.target.value)}
                        />
                    </Col>
                    <Col>
                        <input type="text" className="form-control" placeholder="Edit Task Description" 
                        value={taskDescription} onChange={(e)=> setTaskDescription(e.target.value)}
                        />
                    </Col>
                    {/* <Col>
                        <input type="text" className="form-control" placeholder="Edit Task Status" 
                        value={taskStatus} 
                        />
                    </Col> */}
                    <Col>
                        <button className="btn btn-primary" onClick={()=> handleSave()} > Add Task </button>
                    </Col>
                </Row>
            </Container>
    <div>
    <Table striped bordered hover size="sm" className="taskTable">
      <thead>
        <tr>
          <th>Sl No</th>
          <th>Task Title</th>
          <th>Task Description</th>
          <th>Task Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {
            data && data.length > 0 ?
            data.map((item)=>{
                return (
                    <tr >                        
                        <td>{item.taskID}</td>
                        <td>{item.taskTitle}</td>
                        <td>{item.taskDescription}</td>
                        <td>{item.taskStatus}</td>
                        <td colSpan={2}>
                            <button className="btn btn-primary mx-2" onClick={()=>handleEdit(item.taskID)}> Edit </button>
                            <button className="btn btn-danger mx-2" onClick={()=>handleDelete(item.taskID)}> Delete </button>

                        </td>
                    </tr>
                )
            })
            : "loading..."
        }       
        
      </tbody>
    </Table>
    </div>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
          <Modal.Title>Update Task Details</Modal.Title>
        </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col>
                        <input type="text" className="form-control" placeholder="Edit Task Title" 
                        value={editTaskTitle} onChange={(e)=> setEditTaskTitle(e.target.value)}
                        />
                    </Col>
                    <Col>
                        <input type="text" className="form-control" placeholder="Edit Task Description" 
                        value={editTaskDescription} onChange={(e)=> setEditTaskDescription(e.target.value)}
                        />
                    </Col>
                    <Col>
                        <input type="text" className="form-control" placeholder="Edit Task Status" 
                        value={editTaskStatus} onChange={(e)=> setEditTaskStatus(e.target.value)}
                        />
                    </Col>                    
                </Row>
            </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
</Fragment>
        
    )
}
export default CRUD;