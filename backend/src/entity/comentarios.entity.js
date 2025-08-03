import { EntitySchema } from "typeorm";

export const ComentariosEntity = new EntitySchema({
        name: "Comentarios",
        tableName: "comentarios",
        columns: {
          id_comentario: {
            type: Number,
            primary: true,
            generated: true,
          },
          contenido: {
            type: String,
            nullable: false,
          },
          fecha_comentario: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
          },
        },
        relations: {
          publicacion: {
            type: "many-to-one",
            target: "Publicaciones",
            joinColumn: { name: "id_publicacion" },
            onDelete: "CASCADE",
          },
          user: {
            type: "many-to-one",
            target: "User", // Aquí coincide con name en UserEntity
            joinColumn: { name: "userId" }, // La clave primaria de UserEntity es "id"
            onDelete: "CASCADE",
          },
      },
  });

  export default ComentariosEntity;
