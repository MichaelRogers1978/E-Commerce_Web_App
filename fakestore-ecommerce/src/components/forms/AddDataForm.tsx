import { useState } from 'react';
import { db } from '../../config/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

interface User {
    id?: string;
    name: string;
    age: number;
}

const AddDataForm: React.FC = () => {
    const [data, setData] = useState<Omit<User, 'id'>>({ name: '', age: 0 });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const key = name as keyof Omit<User, 'id'>;
        setData(prev => ({
            ...prev,
            [key]: key === 'age' ? Number(value) : value,
        }) as Omit<User, 'id'>);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'users'), data);
            alert("Data has been added!");
            setData({ name: '', age: 0 });
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input name = "name" value = {data.name} onChange = {handleChange} placeholder = "Name" />
            <input name = "age" type = "number" value = {data.age} onChange = {handleChange} placeholder = "Age" />
            <button type = "submit">Add User</button>
        </form>
    );
};

export default AddDataForm;