import {
  Lucide,
  Tippy,
  Modal,
  ModalBody,
} from "@/base-components";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchWithToken } from "@/api";

function Main() {
  const navigateTo = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const [listTasks, setListTasks] = useState([]);

  const [handleTaskId, setHandleTaskId] = useState('');
  const [title, setTitle] = useState('');
  const [keyword1, setKeyword1] = useState('');
  const [keyword2, setKeyword2] = useState('');
  const [keyword3, setKeyword3] = useState('');
  let myKeywords = [];

  const handleChangeTitle = e => {
    setTitle(e.target.value);
  };

  const handleChangeKeyword1 = e => {
    setKeyword1(e.target.value);
  };
  const handleChangeKeyword2 = e => {
    setKeyword2(e.target.value);
  };

  useEffect(() => {
    // Obtener mi lista de tareas
    fetchWithToken('list', {}, 'GET').then((res) => { 
      setListTasks(res);
      setIsLoading(false);
    });
  }, []);
  
  const handleSubmit = e => {
    e.preventDefault()
    myKeywords = [keyword1, keyword2, keyword3];
    const taskFiltered = listTasks.find(task => task.id === handleTaskId);

    // Si existe la tarea filtrado por id, devuelve true y actualiza los datos
    if (!!taskFiltered) {
      taskFiltered.title = title;
      taskFiltered.keywords = '[\"' + keyword1 + '\",\"' + keyword2 + '\",\"' + keyword3 + '\"]';

      console.log(myKeywords);

      fetchWithToken(`list/${handleTaskId}`, { title, keywords: myKeywords}, 'PATCH').then((res) => { });
      setEditModal(false);
    }
    else {  // Sino, crear objeto con nueva tarea
      const keywordsList = [...myKeywords];
      const newTask = {
        title ,
        keywords: keywordsList
      };

      fetchWithToken('list', newTask, 'POST').then((res) => { 
        console.log(res);
        setListTasks([...listTasks, res.list]);
      });
      
      setAddModal(false);
    }
  };

  const handleEdit = taskId => {
    // Actualiza el estado del valor del id de la tarea para utilizarlo fuera de la funcion
    setHandleTaskId(taskId);

    // Busca la tarea por su id, y pinta los datos obtenidos en los campos de la modal.
    const taskFind = listTasks.find(task => task.id == taskId);
    const arrayKeywords = JSON.parse(taskFind.keywords);
    
    setTitle(taskFind.title);
    setKeyword1(arrayKeywords[0]);
    setKeyword2(arrayKeywords[1]);
    setKeyword3(arrayKeywords[2]);
    
    // Llama a la modal editar tarea
    setEditModal(true);
  };

  const handleDelete = taskId => {
    // Actualiza el estado del valor del id de la tarea para utilizarlo fuera de la funcion
    setHandleTaskId(taskId);
    setDeleteConfirmationModal(true);
  };

  const confirmDeleteTask = () => {
    fetchWithToken(`list/${handleTaskId}`, {}, 'DELETE').then((res) => { });
    
    setDeleteConfirmationModal(false);
    const newList = listTasks.filter(task => task.id !== handleTaskId);
    setListTasks(newList);
  };

  const handleViewTasks = taskId => {
    navigateTo('/admin/list/' + taskId + '/tasks');
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
        <h2 className="text-3xl font-medium mr-auto">Lista de Tareas</h2>
      </div>
      <div className="intro-y flex items-right mt-4">
        <button
          href="#"
          onClick={() => {
            setAddModal(true);
          }}
          className="btn btn-primary shadow-md mr-2">
          Nueva Tarea
        </button>
      </div>

      <div
        className="flex flex-wrap justify-center">
        {/* BEGIN: Page Layout */}
        {
          //map para pintar mi lista
          listTasks.map((task) => {
            return (
              <div 
                key={task.id}
                id={task.id}
                className="w-full xs:w-1/2 lg:w-1/3 zoom-in intro-y flex flex-wrap content-between box p-5 mt-5 mr-4">
                  <div>
                    <h3 className="text-2xl font-medium">{task.title}</h3>
                    <p className="text-lg">{task.keywords}</p>
                  </div>

                  <div className="intro-y flex items-center mt-10 pt-5">
                    <Tippy content="Ver Tareas">
                      <Link
                        // onClick={() => {
                        //   handleViewTasks(task.id);
                        // }}
                        // `list/${handleTaskId}`
                        to={`${task.id}/tasks`}
                        className="btn btn-secondary flex items-center mr-3">
                          <Lucide icon="Eye" className="w-4 h-4" />
                      </Link>
                    </Tippy>
                    <Tippy content="Editar">
                      <a
                        href="#"
                        onClick={() => {
                          handleEdit(task.id);
                        }}
                        className="btn btn-outline-secondary flex items-center mr-3">
                          <Lucide icon="CheckSquare" className="w-4 h-4" />
                      </a>
                    </Tippy>
                    <Tippy content="Eliminar">
                      <a
                        href="#"
                        onClick={() => {
                          handleDelete(task.id);
                        }}
                        className="btn btn-danger flex items-center">
                          <Lucide icon="Trash2" className="w-4 h-4" />
                      </a>
                    </Tippy>
                  </div>
              </div>
              );
            })}
        {/* END: Page Layout */}
      </div>

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
                    onChange={handleChangeTitle}
                    placeholder="Título" 
                  />
                </div>
                <div className="mt-3">
                  <label htmlFor="crud-form-2" className="form-label">
                    Palabras Clave
                  </label>
                  <div className="sm:grid grid-cols-3 gap-2">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        onChange={handleChangeKeyword1}
                        placeholder="Clave valor"
                        aria-describedby="input-group-3"
                      />
                    </div>
                    <div className="input-group mt-2 sm:mt-0">
                      <input
                        type="text"
                        className="form-control"
                        onChange={handleChangeKeyword2}
                        placeholder="Clave valor"
                        aria-describedby="input-group-4"
                      />
                    </div>
                    <div className="input-group mt-2 sm:mt-0">
                      <input
                        type="text"
                        className="form-control"
                        name="keyword3"
                        onChange={(e) => setKeyword3(e.target.value)}
                        placeholder="Clave valor"
                        aria-describedby="input-group-5"
                      />
                    </div>
                  </div>
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
                    onChange={handleChangeTitle}
                    placeholder="Título" 
                  />
                </div>
                <div className="mt-3">
                  <label htmlFor="crud-form-2" className="form-label">
                    Palabras Clave
                  </label>
                  <div className="sm:grid grid-cols-3 gap-2">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        value={keyword1}
                        onChange={handleChangeKeyword1}
                        placeholder="Clave valor"
                        aria-describedby="input-group-3"
                      />
                    </div>
                    <div className="input-group mt-2 sm:mt-0">
                      <input
                        type="text"
                        className="form-control"
                        value={keyword2}
                        onChange={handleChangeKeyword2}
                        placeholder="Clave valor"
                        aria-describedby="input-group-4"
                      />
                    </div>
                    <div className="input-group mt-2 sm:mt-0">
                      <input
                        type="text"
                        className="form-control"
                        name="keyword3"
                        value={keyword3}
                        onChange={(e) => setKeyword3(e.target.value)}
                        placeholder="Clave valor"
                        aria-describedby="input-group-5"
                      />
                    </div>
                  </div>
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
            <div className="text-3xl mt-5">Are you sure?</div>
            <div className="text-slate-500 mt-2">
              Do you really want to delete these records? <br />
              This process cannot be undone.
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
              Cancel
            </button>
            <button 
              type="button"
              onClick={confirmDeleteTask}
              className="btn btn-danger w-24">
              Delete
            </button>
          </div>
        </ModalBody>
      </Modal>
      {/* END: Delete Confirmation Modal */}
    </>
  );
}

export default Main;
