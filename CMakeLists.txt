cmake_minimum_required(VERSION 3.25)

project(bare_inspector C)

include(bare)

add_bare_module(bare_inspector)

target_sources(
  ${bare_inspector}
  PRIVATE
    binding.c
)
