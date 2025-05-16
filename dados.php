<?php
$mysqli = new mysqli("192.168.0.2", "4cals", "123@4Cals", "cadastro");

if ($mysqli->connect_error) {
    die("Erro na conexão: " . $mysqli->connect_error);
}

// Inicializa o array de filtros
$filtros = [];

// Verifica os filtros passados via URL
if (isset($_GET['estudante']) && $_GET['estudante'] === 'true') {
    $filtros[] = "'estudante'";  // 'estudante' é a função para estudante
}
if (isset($_GET['funcionario']) && $_GET['funcionario'] === 'true') {
    $filtros[] = "'funcionario'";  // 'funcionario' é a função para funcionário
}
if (isset($_GET['convidado']) && $_GET['convidado'] === 'true') {
    $filtros[] = "'convidado'";  // 'convidado' é a função para convidado
}

// Inicia a consulta SQL
$sql = "SELECT nome, funcao FROM registros";

// Se existirem filtros, adiciona a cláusula WHERE à consulta
if (count($filtros) > 0) {
    $sql .= " WHERE funcao IN (" . implode(", ", $filtros) . ")";
}

// Executa a consulta
$resultado = $mysqli->query($sql);

$dados = [];

// Preenche o array com os dados retornados da consulta
while ($row = $resultado->fetch_assoc()) {
    $dados[] = $row;
}

header('Content-Type: application/json');
echo json_encode($dados);
?>
