export type Role = 'admin' | 'staff' | 'member';

export type PublicUser = {
	id: string;
	name: string;
	email: string;
	role: Role;
	approved: boolean;
};

export function isRole(value: unknown): value is Role {
	return value === 'admin' || value === 'staff' || value === 'member';
}

export function isStaffRole(role: Role | undefined) {
	return role === 'admin' || role === 'staff';
}

export function asBoolean(value: unknown) {
	return value === true || value === 1 || value === '1';
}
