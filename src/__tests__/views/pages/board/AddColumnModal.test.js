import React from 'react';
import { render, fireEvent, screen, waitFor,act } from '@testing-library/react';
import AddColumnModal from '../../../../views/pages/board/AddColumnModal';
import '@testing-library/jest-dom';
import AppSettingService from '../../../../services/app-settings-service'; 
import LocalStorageAdaptor from '../../../../services/adaptors/local-storage-adaptor';


jest.mock('../../../../services/app-settings-service', () => {
  const mockCreateColumn = jest.fn();
  return jest.fn().mockImplementation(() => ({
    createColumn: mockCreateColumn,
  }));
});

const appSettingService = new AppSettingService(new LocalStorageAdaptor())

const mockOnClose = jest.fn();

describe('AddColumnModal', () => {
  const renderComponent = (isOpen = true) => {
    return render(
      <AddColumnModal isOpen={isOpen} onClose={mockOnClose} />
    );
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render modal with form fields when open', () => {
    renderComponent();
    
    expect(screen.getByText('Add Column')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
  });

  it('should show required validation message when name is not provided', async () => {
    renderComponent();

    fireEvent.click(screen.getByRole('button', { name: /Add/i }));

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
    });
  });

  it('should handle close event without submitting', () => {
    renderComponent();

    fireEvent.click(screen.getByRole('button', { name: /Close/i }));
    expect(mockOnClose).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should not close modal when backdropClick is the reason', () => {
    renderComponent();

    fireEvent.keyDown(document.body, { key: 'Escape', code: 'Escape' });

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should display error message when createColumn fails', async () => {
    appSettingService.createColumn.mockImplementation(() => {
      throw new Error('Item already exists');
    });
  
    renderComponent();
  
    const nameInput = screen.getByLabelText('Name');
    fireEvent.change(nameInput, { target: { value: 'Invalid Column' } });
  
    const descriptionInput = screen.getByLabelText('Description');
    fireEvent.change(descriptionInput, { target: { value: 'Test description' } });
  
    fireEvent.click(screen.getByRole('button', { name: /Add/i }));
  
    await waitFor(() => {
      expect(screen.getByText('Item already exists')).toBeInTheDocument();
    });
  });

  it('should call createColumn with correct values and close modal on valid submit', async () => {
    appSettingService.createColumn.mockImplementation(() => {});

    renderComponent();

    const nameInput = screen.getByLabelText('Name');
    const descriptionInput = screen.getByLabelText('Description');

    await act(async () => {
      fireEvent.change(nameInput, { target: { value: 'New Column' } });
      fireEvent.change(descriptionInput, { target: { value: 'This is a test description.' } });
      fireEvent.click(screen.getByRole('button', { name: /Add/i }));
    });
    expect(appSettingService.createColumn).toHaveBeenCalledWith({
      name: 'New Column',
      description: 'This is a test description.',
      id: expect.any(String),
    });
    expect(mockOnClose).toHaveBeenCalledWith(true);
  });
});









