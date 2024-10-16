import React, { useState } from 'react';

export function FormGeneric({ fields }) {
    const [formData, setFormData] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Nombre:</label>
                <input
                    type="text"
                    name="nombre"
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>Edad:</label>
                <input
                    type="number"
                    name="edad"
                    onChange={handleChange}
                />
            </div>

            {fields.map((field, index) => {
                switch (field.type) {
                    case 'text':
                        return (
                            <div key={index}>
                                <label>{field.label}</label>
                                <input
                                    type="text"
                                    name={field.name}
                                    onChange={handleChange}
                                />
                            </div>
                        );
                    case 'number':
                        return (
                            <div key={index}>
                                <label>{field.label}</label>
                                <input
                                    type="number"
                                    name={field.name}
                                    onChange={handleChange}
                                />
                            </div>
                        );
                    case 'email':
                        return (
                            <div key={index}>
                                <label>{field.label}</label>
                                <input
                                    type="email"
                                    name={field.name}
                                    onChange={handleChange}
                                />
                            </div>
                        );
                    case 'select':
                        return (
                            <div key={index}>
                                <label>{field.label}</label>
                                <select name={field.name} onChange={handleChange}>
                                    {field.options.map((option, idx) => (
                                        <option key={idx} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        );
                    default:
                        return null;
                }
            })}
            <button type="submit">Enviar</button>
        </form>
    );
};
