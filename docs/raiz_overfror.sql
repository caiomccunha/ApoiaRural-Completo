-- Active: 1750714113071@@127.0.0.1@3306@raiz_overfror
create database raiz_overfror;
use raiz_overfror;

create table usuario(
id bigint primary key auto_increment not null,
nome varchar (200) not null,
email VARCHAR(200) not null UNIQUE,
documento VARchar (14) not null unique,
cep varchar (500) not null,
cidade varchar (60) not null,
estado varchar (60) not null,
telefone VARCHAR (300) not null,
tipo_usuario enum ('APOIADOR', 'PRODUTOR') not null,
tipo_apoiador enum ('PESSOA_FISICA', 'ONG', 'EMPRESA/COMERCIO, CONVENIADO'),
biografia text,
foto_perfil longblob,
senha varchar (50) not null
);

alter table usuario 
add column foto_perfil mediumblob;

create table demandas(
id bigint auto_increment primary key unique not null,
id_usuario bigint not NULL,
titulo varchar (250) not null,
descricao text not null,
categoria enum ('graos', 'feijoes_raizes', 'frutas_hortalicas', 'verduras_ervas', 'outros'),
data_postagem datetime,
status enum ('aberta', 'fechada'),
cidade VARCHAR (60) NOT NULL,
estado VARCHAR (60) not NULL,
tipo_apoio enum ('compra_direta', 'investimento_financeiro', 'infraestrutura', 'maquinario_equipamentos'),
foreign key (id_usuario) references usuario (id)
ON DELETE CASCADE
);
CREATE TABLE post (
	id BIGINT NOT NULL AUTO_INCREMENT,
	message TEXT,
	likes INT DEFAULT 0,
	nome_arquivo_post VARCHAR(255),
	tipo_mime_post VARCHAR(50),
	foto_post LONGBLOB,
	PRIMARY KEY (id)
);

CREATE TABLE comment (
    id BIGINT NOT NULL AUTO_INCREMENT,
    content TEXT,
    post_id BIGINT,
    PRIMARY KEY (id),
    CONSTRAINT fk_comment_post
        FOREIGN KEY (post_id)
        REFERENCES post(id)
        ON DELETE CASCADE
);
select * from usuario;