| PRAGMA / Parámetro      | dev                 | QA                  | prod                                   | Nota |
|-------------------------|---------------------|---------------------|----------------------------------------|------|
| journal_mode            | WAL                 | WAL                 | WAL                                    | —    |
| synchronous             | NORMAL              | NORMAL              | NORMAL (**FULL** en eventos críticos)  | —    |
| wal_autocheckpoint      | 500                 | 1000                | 1000                                   | Ajustar por métricas |
| busy_timeout (ms)       | 3000                | 5000                | 5000                                   | —    |
| page_size (al crear)    | 4096                | 4096                | 4096                                   | NTFS típico |
| auto_vacuum             | INCREMENTAL         | INCREMENTAL         | INCREMENTAL                            | Ejecutar incremental_vacuum en valle |
| foreign_keys            | ON                  | ON                  | ON                                     | —    |
| trusted_schema          | OFF                 | OFF                 | OFF                                    | Si no se usan extensiones |
| Umbral WAL (MB)         | 128                 | 256                 | 256                                    | TRUNCATE si supera |
