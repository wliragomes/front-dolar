import React, { useEffect } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    FormControl,
    FormLabel,
    Input,
} from "@chakra-ui/react";

function ModalCadastro({ isOpen, onClose, formData, setFormData, handleSave, isEditing }) {
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handleClose = () => {
        setFormData({ data: '', valor: '' });
        onClose();
    };

    useEffect(() => {
        if (!isOpen) {
            setFormData({ data: '', valor: '' });
        }
    }, [isOpen, setFormData]);

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{isEditing ? 'Editar Registro' : 'Novo Registro'}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl display="flex" flexDir="column" gap="5">
                        <FormLabel htmlFor="data">Data</FormLabel>
                        <Input id="data" type="date" value={formData.data} onChange={handleInputChange} />
                        <FormLabel htmlFor="valor">Valor</FormLabel>
                        <Input id="valor" value={formData.valor} onChange={handleInputChange} />
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={handleSave}>
                        Salvar
                    </Button>
                    <Button variant="ghost" onClick={handleClose}>Cancelar</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default ModalCadastro;
