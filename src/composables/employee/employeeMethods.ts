
export function useEmployee() {
    function fullName(employee: any) {
        return `${employee.name} ${employee.surname}`;
    }
}