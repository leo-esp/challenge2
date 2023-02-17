import { useState, Fragment } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import { Transition, Dialog } from '@headlessui/react'
import axios from 'axios';
import './index.css'

const baseUrl = 'https://api.github.com';

interface User {
    login: string;
    avatar_url: string;
    html_url: string;
}

interface UserData {
    avatar_url: string;
    name: string;
    login: string;
    location: string;
    email: string;
    public_repos: number;
}

function App() {
    const [error, setError] = useState<string>('');
    const [users, setUsers] = useState<User[]>([]);
    const [text, setText] = useState<string>('');
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<UserData | undefined>(undefined);

    const getUserByText = async () => {
        setError('');
        try {
            const res = await axios.get(`${baseUrl}/search/users`, { params: { q: text } });
            const users = res.data.items.map(({ login, html_url, avatar_url }: User) => ({ login, html_url, avatar_url }));
            setUsers(users);
        } catch (error: any) {
            setError('Ocorreu algum erro!');
        }


    }

    const getUsersDetails = async (username: string) => {
        const res = await axios.get(`${baseUrl}/users/${username}`);
        setSelectedUser(res.data);
    }

    return (
        <div className='container flex flex-col items-center w-full h-full mx-auto mt-16'>
            <h1 className="text-3xl text-gray-900 font-bold">Github Search</h1>

            <div className='flex flex-row mt-4'>
                <input className="shadow-xl border-solid border-2 border-gray-500 p-2 rounded-md mr-4" name="search" placeholder="Buscar" type="text" onChange={(e) => setText(e.target.value)} />
                <button className="p-2 rounded-full bg-blue-400" onClick={getUserByText}><MagnifyingGlassIcon className='w-8 h-8 p-1.5 fill-white' /></button>
            </div>
            {error === '' && <ul className='mt-8 flex flex-col '>
                {
                    users.map(user => (
                        <li
                            className='flex mt-4 mb-4 border-solid border border-slate-400 rounded-lg p-2 cursor-pointer shadow-md'
                            key={user.login}
                            onClick={() => { getUsersDetails(user.login); setIsOpen(true) }}
                        >
                            <img className='w-12 mr-4 rounded-full' src={user.avatar_url} alt="Avatar" />
                            <div className='flex flex-col justify-center'>
                                <span className='font-semibold'>{user.login}</span>
                                <span className='text-sm font-light text-slate-500'>{user.html_url}</span>
                            </div>
                        </li>
                    ))
                }
            </ul>
            }
            {
                error !== '' &&
                <h1 className='mt-16 text-red-800 font-semibold'>{error}</h1>
            }
            {
                users.length === 0 && error === '' &&
                <h1>Não foram encontrados usuários</h1>
            }
            <Transition.Root show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => { setIsOpen(false); setSelectedUser(undefined) }}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg" data-cy="modal">
                                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 flex items-center">
                                        <img className='w-36 h-36 mr-8 rounded-full self-center' src={selectedUser?.avatar_url} alt="Avatar" />
                                        <div className="sm:flex sm:items-start flex flex-col">
                                            <span className='font-bold text-xl'>{selectedUser?.name}</span>
                                            <span className='font-semibold text-base'>{selectedUser?.login}</span>
                                            <span className='text-sm'>{selectedUser?.location ? selectedUser.location : 'Localização não informada'}</span>
                                            <span className='text-sm'>{selectedUser?.email ? selectedUser.email : 'E-mail não informado'}</span>
                                            <span className='text-sm font-light'>{`${selectedUser?.public_repos} repositórios públicos`}</span>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </div>
    );
}

export default App;
