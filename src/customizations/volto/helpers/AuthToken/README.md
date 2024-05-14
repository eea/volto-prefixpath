The customization here is the use of prefixPath as a starting point in cookie creation.

```
cookies.set(
            'auth_token',
            currentValue,
            getCookieOptions({
              expires: new Date(jwtDecode(currentValue).exp * 1000),
              path: config.settings.prefixPath ?? '/',
            }),
          );
```
