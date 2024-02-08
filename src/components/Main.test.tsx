import { render, fireEvent, waitFor } from '@testing-library/react';
import Main from './Main';

jest.mock('react-chartjs-2', () => ({
    Line: jest.fn(() => null), // Mocking Line component
}));

describe('Main Component', () => {
    it('fetches data when button is clicked with selected date', async () => {
        const mockFetch = jest.fn().mockResolvedValue({
            ok: true,
            text: () =>
                Promise.resolve(
                    '2024-05-24T08:31:42Z 100.4926\n2024-05-24T08:33:17Z 99.9341'
                ),
        });
        global.fetch = mockFetch;

        const { getByText, getByLabelText } = render(<Main />);

        const input = getByLabelText('Select date');
        fireEvent.change(input, { target: { value: '2024-05-24' } });

        const fetchButton = getByText('Fetch Data');
        fireEvent.click(fetchButton);

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith(
                'https://tsserv.tinkermode.dev/data?begin=2024-05-24T00:00:00.000Z&end=2024-02-09T07:59:59.999Z'
            );
        });
    });

    it('does not fetch data when button is clicked without selecting a date', async () => {
        const mockFetch = jest.fn();
        global.fetch = mockFetch;

        const { getByText } = render(<Main />);

        const fetchButton = getByText('Fetch Data');
        fireEvent.click(fetchButton);

        expect(mockFetch).not.toHaveBeenCalled();
    });

    it('displays an error message if API call fails', async () => {
        const mockFetch = jest.fn().mockRejectedValue(new Error('API call failed'));
        global.fetch = mockFetch;

        const { getByText, getByLabelText } = render(<Main />);

        const input = getByLabelText('Select date');
        fireEvent.change(input, { target: { value: '2024-05-24' } });

        const fetchButton = getByText('Fetch Data');
        fireEvent.click(fetchButton);

        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith(
                'https://tsserv.tinkermode.dev/data?begin=2024-05-24T00:00:00.000Z&end=2024-02-09T07:59:59.999Z'
            );
            expect(getByText('Failed to fetch data')).toBeInTheDocument();
        });
    });
});
