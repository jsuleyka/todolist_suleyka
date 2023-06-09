import {
  Alert,
  Lucide,
  Modal,
  ModalBody,
} from "@/base-components";
import classnames from "classnames";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { fetchWithToken } from "@/api";

function Main() {
  const { taskId } = useParams();
  // const isPostRoute = useRouteMatch("/page-2/:taskId");

  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [statusConfirmationModal, setStatusConfirmationModal] = useState(false);
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  
  const [handleSubTaskId, setHandleSubTaskId] = useState('');
  const [listTasks, setListTasks] = useState([]);
  const [subTasks, setSubTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState(false);
  
  // Obtener mi lista de subtareas
  const listFetching = () => {
    fetchWithToken(`list/${taskId}/tasks`, {}, 'GET').then((res) => { 
      setSubTasks(res);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    listFetching();

    fetchWithToken('list', {}, 'GET').then((res) => { 
      setListTasks(res);
    });
  }, [taskId]);

  if (!subTasks) return null;

  const subTasksCompleted = subTasks.filter(subTask => subTask.completed);
  const subTasksPend = subTasks.filter(subTask => !subTask.completed);
  const taskFind = listTasks.filter(task => { 
    return task.id == taskId
  })[0]; 

  if (!taskFind) return null;

  const handleSubmit = e => {
    e.preventDefault();
    const subTaskFiltered = subTasks.find(subTask => subTask.id === handleSubTaskId);

    // Si existe la tarea filtrado por id, devuelve true y actualiza los datos
    if (!!subTaskFiltered) {
      subTaskFiltered.title = title;

      fetchWithToken(`list/${taskId}/tasks/${handleSubTaskId}`, { title }, 'PATCH').then((res) => {
        if (res.status) {
          setNotification({
            type: "error",
            message: "Título no puede estar vacío",
          });
        } else {
          setNotification({
            type: "success",
            message: "Tarea actualizada correctamente",
          });

          setEditModal(false);
        }
      });
    }
    else {  // Sino, crear objeto con nueva tarea
      const newSubTask = {
        title,
        completed: false
      };

      fetchWithToken(`list/${taskId}/tasks`, newSubTask, 'POST').then((res) => {
        if (res.status) {
          setNotification({
            type: "error",
            message: "Título no puede estar vacío",
          });
        } else {
          setNotification({
            type: "success",
            message: "Tarea creada correctamente",
          });

          setSubTasks([...subTasks, res]);
          setAddModal(false);
        }
      });
    }
  };

  const handleEdit = subTaskId => {
    // Actualiza el estado del valor del id de la tarea para utilizarlo fuera de la funcion
    setHandleSubTaskId(subTaskId);

    // Busca la tarea por su id, y pinta los datos obtenidos en los campos de la modal.
    const subTaskFind = subTasks.find(subTask => subTask.id == subTaskId);
    setTitle(subTaskFind.title);

    // Llama a la modal editar tarea
    setEditModal(true);
  };

  const handleStatus = subTaskId => {
    // Actualiza el estado del valor del id de la tarea para utilizarlo fuera de la funcion
    setHandleSubTaskId(subTaskId);

    // Busca la tarea por su id, y pinta los datos obtenidos en los campos de la modal.
    const subTaskFind = subTasks.find(subTask => subTask.id == subTaskId);
    setStatus(subTaskFind.completed);

    // Llama a la modal actualizar estado
    setStatusConfirmationModal(true);
  };

  const confirmStatusTask = () => {
    const subTaskFiltered = subTasks.find(subTask => subTask.id == handleSubTaskId);
    if (!!subTaskFiltered) {
      subTaskFiltered.completed = !status;

      fetchWithToken(`list/${taskId}/tasks/${handleSubTaskId}`, { completed: !status }, 'PATCH').then((res) => {
        if (res.status) {
          setNotification({
            type: "error",
            message: "Hubo un error.",
          });
        } else {
          setNotification({
            type: "success",
            message: "Estado actualizado correctamente",
          });

          setStatusConfirmationModal(false);
        }
      });
    }
  };

  const handleDelete = subTaskId => {
    // Actualiza el estado del valor del id de la tarea para utilizarlo fuera de la funcion
    setHandleSubTaskId(subTaskId);
    setDeleteConfirmationModal(true);
  };

  const confirmDeleteTask = () => {
    fetchWithToken(`list/${taskId}/tasks/${handleSubTaskId}`, {}, 'DELETE').then((res) => {
      if (res.msg) {
        setNotification({
          type: "success",
          message: res.msg,
        });

        setDeleteConfirmationModal(false);
        const newList = subTasks.filter(subTask => subTask.id !== handleSubTaskId);
        setSubTasks(newList);
      } else {
        setNotification({
          type: "error",
          message: "Hubo un error.",
        });
      }
    });
  };

  if (isLoading) { // si está cargando, mostramos un texto que lo indique
    return (
      <div className="h-screen flex justify-center items-center">
        <div role="status">
            <svg className="inline mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
            <span className="sr-only">Loading...</span>
        </div>
    </div>
    );
  }

  return (
    <>
      <div className="intro-y flex items-center mt-8">
        <h2 className="text-3xl font-medium mr-auto">{taskFind.title}</h2>

        <button
          href="#"
          onClick={() => {
            setAddModal(true);
          }}
          className="btn btn-primary shadow-md">
          Nueva Tarea
        </button>
      </div>

      {/* BEGIN: Page Layout */}
      {
        //map para pintar mi lista de tareas pendientes
        subTasksPend.map((subTask) => { 
          return (
            <div 
              key={subTask.id}
              id={subTask.id}
              className="zoom-in intro-y box p-5 mt-5 sm:flex items-center">
                <h3 className="font-medium mr-auto mb-2 sm:mb-0">{subTask.title}</h3>

                <div className="sm:w-auto sm:flex">
                  <div className="flex mr-3">
                    <a
                      onClick={() => {
                        handleStatus(subTask.id);
                      }} 
                      className={classnames({
                      "flex items-center": true,
                      "text-success": subTask.completed,
                      "text-danger": !subTask.completed, 
                      })} 
                      href="#">
                        <Lucide icon="CheckSquare" className="w-4 h-4 mr-1" />
                        {subTask.completed ? "Completado" : "Pendiente"}
                    </a>
                  </div>

                  <a
                    onClick={() => {
                      handleEdit(subTask.id);
                    }}
                    className="flex items-center mr-3" href="#">
                      <Lucide icon="CheckSquare" className="w-4 h-4 mr-1" />
                      Editar
                  </a>
                  <a
                    onClick={() => {
                      handleDelete(subTask.id);
                    }}
                    className="flex items-center text-danger" href="#">
                      <Lucide icon="Trash2" className="w-4 h-4 mr-1" />
                      Eliminar
                  </a>
                </div>
            </div>
          );
        })
      }
      {/* END: Page Layout */}

      {/* BEGIN: Page Layout */}
      {
        //map para pintar mi lista de tareas completadas
        subTasksCompleted.map((subTask) => { 
          return (
            <div 
              key={subTask.id}
              id={subTask.id}
              className="zoom-in intro-y box p-5 mt-5 sm:flex items-center">
                <h3 className="font-medium mr-auto mb-2 sm:mb-0">{subTask.title}</h3>

                <div className="sm:w-auto sm:flex">
                  <div className="flex mr-3">
                    <a
                      onClick={() => {
                        handleStatus(subTask.id);
                      }} 
                      className={classnames({
                      "flex items-center": true,
                      "text-success": subTask.completed,
                      "text-danger": !subTask.completed, 
                      })} 
                      href="#">
                        <Lucide icon="CheckSquare" className="w-4 h-4 mr-1" />
                        {subTask.completed ? "Completado" : "Pendiente"}
                    </a>
                  </div>

                  <a
                    onClick={() => {
                      handleEdit(subTask.id);
                    }}
                    className="flex items-center mr-3" href="#">
                      <Lucide icon="CheckSquare" className="w-4 h-4 mr-1" />
                      Editar
                  </a>
                  <a
                    onClick={() => {
                      handleDelete(subTask.id);
                    }}
                    className="flex items-center text-danger" href="#">
                      <Lucide icon="Trash2" className="w-4 h-4 mr-1" />
                      Eliminar
                  </a>
                </div>
            </div>
          );
        })
      }
      {/* END: Page Layout */}

      {/* BEGIN: Add Task Modal */}
      <Modal
        show={addModal}
        onHidden={() => {
          setAddModal(false);
        }}
      >
        <ModalBody className="p-0">
          <div className="p-5">
            <div className="text-3xl mt-5 mb-2 text-center">Nueva Tarea</div>
            <form 
              onSubmit={handleSubmit}
              className="space-y-6 mt-2" 
              action="#">
                <div>
                  <label htmlFor="crud-form-1" className="form-label">
                    Título
                  </label>
                  <input
                    id="crud-form-1"
                    type="text"
                    className="form-control w-full"
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Título" 
                  />
                </div>
            </form>
          </div>
          <div className="px-5 pb-8 text-right mt-5">
            <button
              type="button"
              onClick={() => {
                setAddModal(false);
              }}
              className="btn btn-outline-secondary w-24 mr-1"
            >
              Cancelar
            </button>
            <button 
              onClick={handleSubmit}
              type="button"
              className="btn btn-primary w-24">
              Agregar
            </button>
          </div>
        </ModalBody>
      </Modal>
      {/* END: Add Task Modal */}

      {/* BEGIN: Edit Task Modal */}
      <Modal
        show={editModal}
        onHidden={() => {
          setEditModal(false);
        }}
      >
        <ModalBody className="p-0">
          <div className="p-5">
            <div className="text-3xl mt-5 mb-2 text-center">Editar Tarea</div>
            <form 
              onSubmit={handleSubmit}
              className="space-y-6 mt-2" 
              action="#">
                <div>
                  <label htmlFor="crud-form-1" className="form-label">
                    Título
                  </label>
                  <input
                    id="crud-form-1"
                    type="text"
                    className="form-control w-full"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Título"
                  />
                </div>
            </form>
          </div>
          <div className="px-5 pb-8 text-right mt-5">
            <button
              type="button"
              onClick={() => {
                setEditModal(false);
              }}
              className="btn btn-outline-secondary w-24 mr-1"
            >
              Cancelar
            </button>
            <button 
              onClick={handleSubmit}
              type="button"
              className="btn btn-primary w-24">
              Actualizar
            </button>
          </div>
        </ModalBody>
      </Modal>
      {/* END: Edit Task Modal */}

      {/* BEGIN: Status Confirmation Modal */}
      <Modal
        show={statusConfirmationModal}
        onHidden={() => {
          setStatusConfirmationModal(false);
        }}
      >
        <ModalBody className="p-0">
          <div className="p-5 text-center">
            <Lucide
              icon="XCircle"
              className="w-16 h-16 text-danger mx-auto mt-3"
            />
            <div className="text-3xl mt-5">¿Está seguro?</div>
            <div className="text-slate-500 mt-2">
              ¿Realmente desea actualizar el estado de este registro? <br />
            </div>
          </div>
          <div className="px-5 pb-8 text-center">
            <button
              type="button"
              onClick={() => {
                setStatusConfirmationModal(false);
              }}
              className="btn btn-outline-secondary w-24 mr-1"
            >
              Cancelar
            </button>
            <button 
              type="button"
              onClick={confirmStatusTask}
              className="btn btn-danger w-24">
              Confirmar
            </button>
          </div>
        </ModalBody>
      </Modal>
      {/* END: Status Confirmation Modal */}

      {/* BEGIN: Delete Confirmation Modal */}
      <Modal
        show={deleteConfirmationModal}
        onHidden={() => {
          setDeleteConfirmationModal(false);
        }}
      >
        <ModalBody className="p-0">
          <div className="p-5 text-center">
            <Lucide
              icon="XCircle"
              className="w-16 h-16 text-danger mx-auto mt-3"
            />
            <div className="text-3xl mt-5">¿Está seguro?</div>
            <div className="text-slate-500 mt-2">
              ¿Realmente desea eliminar este registro? <br />
              Este proceso no se puede deshacer.
            </div>
          </div>
          <div className="px-5 pb-8 text-center">
            <button
              type="button"
              onClick={() => {
                setDeleteConfirmationModal(false);
              }}
              className="btn btn-outline-secondary w-24 mr-1"
            >
              Cancelar
            </button>
            <button 
              type="button"
              onClick={confirmDeleteTask}
              className="btn btn-danger w-24">
              Eliminar
            </button>
          </div>
        </ModalBody>
      </Modal>
      {/* END: Delete Confirmation Modal */}

      {/* BEGIN: Alert Content */}       
      {notification.type.includes("error") && (
        <Alert className="fixed z-50 top-[5vw] right-[5vw] alert-danger w-[20vw] flex items-center mb-2">
          {({ dismiss }) => (
            <>
              <Lucide icon="AlertOctagon" className="w-6 h-6 mr-2" />
              <span>{notification.message}</span>
              <button
                type="button"
                className="btn-close text-white"
                aria-label="Close"
                onClick={() => {
                  dismiss();
                  setNotification({ type: "", message: "" });
                }}
              >
                <Lucide icon="X" className="ml-5 w-4 h-4" />
              </button>
            </>
          )}
        </Alert>
      )}

      {notification.type.includes("success") && (
        <Alert className="fixed z-50 top-[5vw] right-[5vw] alert-success text-white w-[20vw] flex items-center mb-2">
          {({ dismiss }) => (
            <>
              <Lucide icon="AlertTriangle" className="w-6 h-6 mr-2" />
              <span>{notification.message}</span>
              <button
                type="button"
                className="btn-close text-white"
                aria-label="Close"
                onClick={() => {
                  dismiss();
                  setNotification({ type: "", message: "" });
                }}
              >
                <Lucide icon="X" className="ml-5 w-4 h-4" />
              </button>
            </>
          )}
        </Alert>
      )}
      {/* END: Alert Content */}
    </>
  );
}

export default Main;
