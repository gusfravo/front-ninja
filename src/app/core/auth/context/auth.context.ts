import { HttpContextToken } from '@angular/common/http';

// Definiendo un token para una propiedad booleana
export const IS_TOKENENABLED = new HttpContextToken<boolean>(() => false);
