import { Button, Modal, Spinner } from "react-bootstrap";

import React from "react";

export type ConfirmVariant = "danger" | "warning" | "primary" | "secondary";

export interface ConfirmModalProps {
  show: boolean;

  title?: string;
  message?: React.ReactNode;

  confirmText?: string;
  cancelText?: string;

  variant?: ConfirmVariant;
  loading?: boolean;

  disableBackdropClose?: boolean;
  size?: "sm" | "lg" | "xl";

  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  show,
  title = "Confirmar ação",
  message = "Tem certeza que deseja continuar?",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "danger",
  loading = false,
  disableBackdropClose = true,
  size,
  onConfirm,
  onCancel}: ConfirmModalProps) {
  const handleCancel = () => {
    if (loading) return;
    onCancel();
  };

  const handleConfirm = () => {
    if (loading) return;
    onConfirm();
  };

  return (
    <Modal
      show={show}
      onHide={handleCancel}
      centered
      backdrop={disableBackdropClose ? "static" : true}
      keyboard={!loading}
      size={size}
    >
      <Modal.Header closeButton={!loading}>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>{message}</Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleCancel} disabled={loading}>
          {cancelText}
        </Button>

        <Button variant={variant} type="button" onClick={handleConfirm} disabled={loading}>
          {loading ? (
            <>
              <Spinner size="sm" className="me-2" animation="border" />
              Processando…
            </>
          ) : (
            confirmText
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
